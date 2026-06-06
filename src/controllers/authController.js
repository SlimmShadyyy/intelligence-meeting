// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const { sendSuccess, sendError } = require('../utils/response');

const login = (req, res) => {
    const { email, password } = req.body;

    // For the sake of the assignment, we use a hardcoded mock user
    if (email === 'admin@example.com' && password === 'password123') {
        // Generate a token valid for 24 hours
        const token = jwt.sign(
            { email: email, role: 'admin' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        return sendSuccess(res, req, { token });
    }

    return sendError(res, req, 401, 'UNAUTHORIZED', 'Invalid email or password');
};

module.exports = { login };