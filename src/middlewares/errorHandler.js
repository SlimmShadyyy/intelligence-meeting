const { sendError } = require('../utils/response');

const globalErrorHandler = (err, req, res, next) => {
    console.error(`[${req.traceId}] Error:`, err);
    sendError(res, req, 500, 'INTERNAL_SERVER_ERROR', 'Something went wrong');
};

module.exports = globalErrorHandler;