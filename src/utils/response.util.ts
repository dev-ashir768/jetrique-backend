import { Response } from 'express';
import z, { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const sendSuccess = (
  res: Response,
  data: unknown,
  message: string = 'Success',
  statusCode: number = StatusCodes.OK,
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string = 'Something went wrong',
  statusCode: number = StatusCodes.BAD_REQUEST,
  error?: ZodError,
) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(error && { error: z.treeifyError(error) }),
    data: null,
  });
};
