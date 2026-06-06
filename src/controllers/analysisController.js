const prisma = require('../utils/db');
const { analyzeTranscriptWithAI } = require('../services/aiService');
const { sendSuccess, sendError } = require('../utils/response');

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
        const aiAnalysisResult = await analyzeTranscriptWithAI(meeting.transcripts);
        
        // 2. Automatically push Gemini's action items into the ActionItem database table
        // FIXED: Changed 'aiData' to 'aiAnalysisResult'
        if (aiAnalysisResult.actionItems && aiAnalysisResult.actionItems.length > 0) {
            for (const item of aiAnalysisResult.actionItems) {
                await prisma.actionItem.create({
                    data: {
                        meetingId: id, // The ID of the meeting being analyzed
                        task: item.task,
                        assignee: item.assignee,
                        // AI doesn't generate dates, so we default the due date to 7 days from now!
                        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
                    }
                });
            }
        }
        
        return sendSuccess(res, req, aiAnalysisResult);
    } catch (error) {
        next(error);
    }
};

module.exports = { analyzeMeeting };