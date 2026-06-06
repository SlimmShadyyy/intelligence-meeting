const express = require('express');
const router = express.Router();
const { 
    createMeeting, 
    getMeeting, 
    listMeetings, 
    analyzeMeeting 
} = require('../controllers/meetingController');

router.post('/', createMeeting);
router.get('/', listMeetings);
router.get('/:id', getMeeting);

/**
 * @swagger
 * /api/meetings/{id}/analyze:
 *   post:
 *     summary: Analyze meeting transcript with AI
 *     description: Parses meeting transcripts using Gemini AI and extracts action items.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analysis completed successfully
 *       404:
 *         description: Meeting not found
 */


router.post('/:id/analyze', (req, res, next) => {
    analyzeMeeting(req, res, next);
});

module.exports = router;