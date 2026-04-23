import { logger } from '@/config/logger.config';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode =
    err instanceof AppError
      ? err.statusCode
      : res.statusCode === StatusCodes.OK
        ? StatusCodes.INTERNAL_SERVER_ERROR
        : res.statusCode;

  logger.error(`${statusCode} - ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    data: null,
  });
};
