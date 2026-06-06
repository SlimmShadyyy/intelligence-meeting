// src/controllers/meetingController.js
const prisma = require('../utils/db');
const { sendSuccess, sendError } = require('../utils/response');
const { analyzeTranscriptWithAI } = require('../services/aiService'); // <-- Added missing import

// POST /api/meetings
const createMeeting = async (req, res, next) => {
    try {
        const { title, participants, meetingDate, transcript } = req.body;

        if (!title || !participants || !Array.isArray(participants) || !meetingDate || !transcript) {
            return sendError(res, req, 400, 'VALIDATION_ERROR', 'Missing or invalid required fields.');
        }

        const meeting = await prisma.meeting.create({
            data: {
                title,
                meetingDate: new Date(meetingDate),
                participants: JSON.stringify(participants), 
                transcripts: {
                    create: transcript.map(t => ({
                        timestamp: t.timestamp,
                        speaker: t.speaker,
                        text: t.text
                    }))
                }
            },
            include: {
                transcripts: true 
            }
        });

        const responseData = { ...meeting, participants: JSON.parse(meeting.participants) };
        return sendSuccess(res, req, responseData);

    } catch (error) {
        next(error); 
    }
};

// GET /api/meetings/:id
const getMeeting = async (req, res, next) => {
    try {
        const { id } = req.params;

        const meeting = await prisma.meeting.findUnique({
            where: { id },
            include: { transcripts: true, actionItems: true }
        });

        if (!meeting) {
            return sendError(res, req, 404, 'NOT_FOUND', 'Meeting not found');
        }

        const responseData = { ...meeting, participants: JSON.parse(meeting.participants) };
        return sendSuccess(res, req, responseData);

    } catch (error) {
        next(error);
    }
};

// GET /api/meetings
const listMeetings = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [meetings, total] = await Promise.all([
            prisma.meeting.findMany({
                skip,
                take: limit,
                orderBy: { meetingDate: 'desc' }
            }),
            prisma.meeting.count()
        ]);

        const formattedMeetings = meetings.map(m => ({
            ...m,
            participants: JSON.parse(m.participants)
        }));

        return sendSuccess(res, req, {
            data: formattedMeetings,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
        });

    } catch (error) {
        next(error);
    }
};

// POST /api/meetings/:id/analyze
// POST /api/meetings/:id/analyze
const analyzeMeeting = async (req, res, next) => {
    try {
        const { id } = req.params;

        const meeting = await prisma.meeting.findUnique({
            where: { id },
            include: { transcripts: true }
        });

        if (!meeting) return sendError(res, req, 404, 'NOT_FOUND', 'Meeting not found');
        if (!meeting.transcripts || meeting.transcripts.length === 0) return sendError(res, req, 400, 'BAD_REQUEST', 'No transcript found');

        // 1. Get the data from Gemini
        let aiAnalysisResult = await analyzeTranscriptWithAI(meeting.transcripts);
        
        // BULLETPROOFING: If the AI accidentally returned a string, parse it into a real JSON object
        if (typeof aiAnalysisResult === 'string') {
            aiAnalysisResult = JSON.parse(aiAnalysisResult);
        }

        console.log("👀 DEBUG - AI Data structure:", Object.keys(aiAnalysisResult));
        
        // 2. Automatically push Gemini's action items into the database
        if (aiAnalysisResult && aiAnalysisResult.actionItems && Array.isArray(aiAnalysisResult.actionItems)) {
            console.log(`🚀 DEBUG - Found ${aiAnalysisResult.actionItems.length} action items. Inserting to database...`);
            
            for (const item of aiAnalysisResult.actionItems) {
                await prisma.actionItem.create({
                    data: {
                        meetingId: id,
                        task: item.task || 'No task provided',
                        assignee: item.assignee || 'Unassigned',
                        // DEMO DAY HACK: Make tasks instantly overdue (-7 days)
                        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
                    }
                });
                console.log(`✅ DEBUG - Successfully saved task: "${item.task}"`);
            }
        } else {
            console.log("❌ DEBUG - Silent Skip! Could not find actionItems array in the AI response.");
        }
        
        return sendSuccess(res, req, aiAnalysisResult);
    } catch (error) {
        console.error("🔥 DEBUG - Server Error during AI Analysis:", error);
        next(error);
    }
};


// Export ALL FOUR functions!
module.exports = { createMeeting, getMeeting, listMeetings, analyzeMeeting };