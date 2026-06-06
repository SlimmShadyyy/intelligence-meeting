// src/middlewares/traceId.js
const crypto = require('crypto');

const traceIdMiddleware = (req, res, next) => {
    // Generate trace ID using Node's native crypto library
    req.traceId = req.headers['x-trace-id'] || crypto.randomUUID();
    
    // Include trace ID in all responses
    res.setHeader('x-trace-id', req.traceId);
    next();
};

module.exports = traceIdMiddleware;