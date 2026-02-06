"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const error_1 = require("./error");
function errorHandler(err, _req, res, _next) {
    let customError = err instanceof error_1.AppError
        ? err
        : new error_1.AppError(err.message || "Something went wrong", 500, false);
    const { statusCode, message, isOperational } = customError;
    if (!isOperational) {
        console.error(err);
    }
    res.status(statusCode).json({
        status: "error",
        message: message,
    });
}
