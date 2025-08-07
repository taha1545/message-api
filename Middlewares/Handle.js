const { ValidationError: ExpressValidationError } = require('express-validator');
const fs = require('fs');

function errorHandler(err, req, res, next) {
    //
    const statusCode = err.statusCode || 500;
    const errMessage = err.message || "Internal Server Error";

    if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Failed to delete file:', err.message);
        });
    }

    if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: "File is too large"
        });
    }

    if (err.errors && Array.isArray(err.errors)) {
        return res.status(400).json({
            success: false,
            message: err.message || "Validation error",
            errors: err.errors
        });
    }

    res.status(statusCode).json({
        success: false,
        message: errMessage,
    });
}

module.exports = errorHandler;


