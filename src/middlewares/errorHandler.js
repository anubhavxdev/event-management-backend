const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            // stack: err.stack, // the app is in dev mode so we can send stack trace, but in prod we will remove the stack trace
        });
    }

    if(err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }

console.log("ERROR:", err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
    });
}