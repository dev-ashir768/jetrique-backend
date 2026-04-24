import { Response, Request } from 'express';
import asyncHandler from 'express-async-handler';
import { auditTrailService } from './audit-trail.service';
import {
  GetCommissionLogsFormType,
  GetPaymentTypeLogsFormType,
} from './audit-trail.schema';
import { sendSuccess } from '@/utils/response.util';
import { StatusCodes } from 'http-status-codes';

export const auditTrailController = {
  // ─── Get Commission Logs ───
  getCommissionLogs: asyncHandler(async (req: Request, res: Response) => {
    const data = await auditTrailService.getCommissionLogs(
      req.query as GetCommissionLogsFormType,
    );
    sendSuccess(
      res,
      data.commissionLogs,
      'Commission Logs Fetched Successfully',
      StatusCodes.OK,
      data.meta,
    );
  }),

  // ─── Get Payment Type Logs ───
  getPaymentTypeLogs: asyncHandler(async (req: Request, res: Response) => {
    const data = await auditTrailService.getPaymentTypeLogs(
      req.query as GetPaymentTypeLogsFormType,
    );
    sendSuccess(
      res,
      data.paymentTypeLogs,
      'Payment Type Logs Fetched Successfully',
      StatusCodes.OK,
      data.meta,
    );
  }),
};
