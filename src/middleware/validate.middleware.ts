import { ValidationSource } from '@/types';
import { sendError } from '@/utils/response.util';
import { Response, NextFunction, Request } from 'express';
import { ZodType } from 'zod';

export const validate = (
  schema: ZodType,
  source: ValidationSource = ValidationSource.BODY,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      sendError(res, 'Validation failed', 422, result.error);
      return;
    }
    req[source] = result.data;
    next();
  };
};
