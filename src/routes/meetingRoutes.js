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
// Change this line temporarily:
router.post('/:id/analyze', (req, res, next) => {
    console.log("🔥 THE ROUTER IS DEFINITELY REACHING THIS FILE NOW!");
    analyzeMeeting(req, res, next);
});

module.exports = router;