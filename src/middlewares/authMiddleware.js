// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

const protect = (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token (e.g., "Bearer eyJhbGciOiJIUz...")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using your secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user info to the request for later use
            req.user = decoded;

            next(); // Pass the request to the next function
        } catch (error) {
            return sendError(res, req, 401, 'UNAUTHORIZED', 'Not authorized, token failed');
        }
    }

    if (!token) {
        return sendError(res, req, 401, 'UNAUTHORIZED', 'Not authorized, no token provided');
    }
};

module.exports = { protect };