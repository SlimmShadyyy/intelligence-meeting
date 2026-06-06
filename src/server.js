// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const traceIdMiddleware = require('./middlewares/traceId');
const globalErrorHandler = require('./middlewares/errorHandler');
const { sendSuccess } = require('./utils/response');
const actionItemRoutes = require('./routes/actionItemRoutes');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middlewares/authMiddleware');
const { startScheduler } = require('./services/scheduler');
const apiLimiter = require('./middlewares/rateLimiter');


const app = express();
const PORT = process.env.PORT || 3000;
const meetingRoutes = require('./routes/meetingRoutes');

// Middleware
app.use(cors()); 
app.use(express.json());
// Serve static files from the "public" folder
app.use(express.static('public'));
app.use(traceIdMiddleware);
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.get('/health', (req, res) => res.json({ status: "UP" }));
app.get('/api/evaluation', /* ... */);

// Protected Routes (Only users with a token can access these!)
app.use('/api/meetings', protect, meetingRoutes);
app.use('/api/action-items', protect, actionItemRoutes);

// Health Endpoint
app.get('/health', (req, res) => {
    res.json({ status: "UP" });
});

// Evaluation Endpoint
app.get('/api/evaluation', (req, res) => {
    res.json({
        candidateName: "Ananniya Acharya",
        email: "ananniyaacharya@gmail.com",
        repositoryUrl: "https://github.com/yourusername/hintro-meeting-intelligence",
        deployedUrl: "Will add later",
        externalIntegration: "Slack Webhook",
        features: ["Authentication", "AI Analysis", "Reminder Scheduler"]
    });
});

// Catch-all for 404 routes (helps the tests pass gracefully!)
app.use((req, res, next) => {
    res.status(404).json({
        traceId: req.traceId,
        success: false,
        error: { code: 'NOT_FOUND', message: 'Route not found' }
    });
});

// Mount global error handler last
app.use(globalErrorHandler);

// Only start the server if we aren't running tests
if (process.env.NODE_ENV !== 'test') {
    // Turn on the background job!
    startScheduler(); 

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export the app for testing
module.exports = app;