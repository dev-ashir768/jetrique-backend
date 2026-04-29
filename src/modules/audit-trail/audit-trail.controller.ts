import { Response, Request } from 'express';
import asyncHandler from 'express-async-handler';
import { auditTrailService } from './audit-trail.service';
import {
  GetAgentStatusLogsFormType,
  GetCommissionLogsFormType,
  GetPaymentTypeLogsFormType,
} from './audit-trail.schema';
import { sendSuccess } from '@/utils/response.util';
import { JWTAccessTokenType } from '@/types';
import { StatusCodes } from 'http-status-codes';

export const auditTrailController = {
  // ─── Get Commission Logs ───
  getCommissionLogs: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as GetCommissionLogsFormType;
    const loggedInUser = req.user as JWTAccessTokenType;

    const data = await auditTrailService.getCommissionLogs(query, loggedInUser);
    sendSuccess(res, data.commissionLogs, 'Commission Logs Fetched Successfully', StatusCodes.OK, data.meta);
  }),

  // ─── Get Payment Type Logs ───
  getPaymentTypeLogs: asyncHandler(async (req: Request, res: Response) => {
    const loggedInUser = {
      userId: req.user?.userId,
      roleSlug: req.user?.roleSlug,
      roleId: req.user?.roleId,
      agentId: req.user?.agentId,
    } as JWTAccessTokenType;

    const data = await auditTrailService.getPaymentTypeLogs(req.query as GetPaymentTypeLogsFormType, loggedInUser);
    sendSuccess(res, data.paymentTypeLogs, 'Payment Type Logs Fetched Successfully', StatusCodes.OK, data.meta);
  }),

  // ─── Get Agent Status Logs ───
  getAgentStatusLogs: asyncHandler(async (req: Request, res: Response) => {
    const loggedInUser = {
      userId: req.user?.userId,
      roleSlug: req.user?.roleSlug,
      roleId: req.user?.roleId,
      agentId: req.user?.agentId,
    } as JWTAccessTokenType;

    const data = await auditTrailService.getAgentStatusLogs(req.query as GetAgentStatusLogsFormType, loggedInUser);
    sendSuccess(res, data.agentStatusLogs, 'Agent Status Logs Fetched Successfully', StatusCodes.OK, data.meta);
  }),
};
