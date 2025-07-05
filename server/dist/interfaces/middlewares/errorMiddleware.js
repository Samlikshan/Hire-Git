"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const http_exception_1 = require("../../domain/enums/http-exception");
const http_status_enum_1 = require("../../domain/enums/http-status.enum");
const winston_logger_1 = require("../../infrastructure/logger/winston.logger");
const errorMiddleware = (error, req, res, next) => {
    try {
        console.log(error);
        const status = error instanceof http_exception_1.HttpException
            ? error.status
            : http_status_enum_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || http_status_enum_1.HttpMessage.INTERNAL_ERROR;
        // Log the error
        winston_logger_1.logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
        res.status(status).json({
            status,
            message,
            timestamp: new Date().toISOString(),
            path: req.path,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.errorMiddleware = errorMiddleware;
