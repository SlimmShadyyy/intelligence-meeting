// src/middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/response');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    handler: (req, res) => {
        // Use your unified error handler for consistency!
        return sendError(res, req, 429, 'TOO_MANY_REQUESTS', 'You have exceeded the 100 requests in 15 mins limit!');
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = apiLimiter;