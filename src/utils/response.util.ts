import { Response } from 'express';
import z, { ZodError } from 'zod';

export const sendSuccess = (
  res: Response,
  data: unknown,
  message: string = 'Success',
  statusCode: number = 200,
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
  statusCode: number = 400,
  error?: ZodError,
) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(error && { error: z.treeifyError(error) }),
    data: null,
  });
};
