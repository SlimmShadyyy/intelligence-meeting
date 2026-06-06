// src/routes/meetingRoutes.js
const express = require('express');
const router = express.Router();
const { 
    createMeeting, 
    getMeeting, 
    listMeetings, 
    analyzeMeeting 
} = require('../controllers/meetingController');

// All standard meeting routes
router.post('/', createMeeting);
router.get('/', listMeetings);
router.get('/:id', getMeeting);

/**
 * @swagger
 * /api/meetings/{id}/analyze:
 * post:
 * summary: Analyze meeting transcript with AI
 * description: Parses meeting transcripts using Gemini AI and extracts action items.
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The ID of the meeting to analyze
 * responses:
 * 200:
 * description: Analysis completed successfully
 * 404:
 * description: Meeting not found
 */
router.post('/:id/analyze', (req, res, next) => {
    console.log("🔥 THE ROUTER IS DEFINITELY REACHING THIS FILE NOW!");
    analyzeMeeting(req, res, next);
});


router.post('/:id/analyze', (req, res, next) => {
    console.log("🔥 THE ROUTER IS DEFINITELY REACHING THIS FILE NOW!");
    analyzeMeeting(req, res, next);
});

module.exports = router;