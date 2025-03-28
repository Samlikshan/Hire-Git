// infrastructure/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { HttpException } from "../../domain/enums/http-exception";
import { HttpMessage, HttpStatus } from "../../domain/enums/http-status.enum";
import { logger } from "../../infrastructure/logger/winston.logger";

export const errorMiddleware = (
  error: HttpException | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(error);
    const status =
      error instanceof HttpException
        ? error.status
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || HttpMessage.INTERNAL_ERROR;

    // Log the error
    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
    );

    res.status(status).json({
      status,
      message,
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  } catch (error) {
    next(error);
  }
};
