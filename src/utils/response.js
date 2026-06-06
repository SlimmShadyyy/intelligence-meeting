const sendSuccess = (res, req, data) => {
    res.status(200).json({
        traceId: req.traceId,
        success: true,
        data: data
    });
};

const sendError = (res, req, statusCode, errorCode, message) => {
    res.status(statusCode).json({
        traceId: req.traceId,
        success: false,
        error: {
            code: errorCode,
            message: message
        }
    });
};

module.exports = { sendSuccess, sendError };