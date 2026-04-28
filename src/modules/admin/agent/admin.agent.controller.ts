import asyncHandler from 'express-async-handler';
import { Response, Request } from 'express';
import { sendError, sendSuccess } from '@/utils/response.util';
import { StatusCodes } from 'http-status-codes';
import { JWTAccessTokenType } from '@/types';
import { adminAgentService } from './admin.agent.service';
import { UpdateAgentFinanceFormType } from './admin.agent.schema';

export const adminAgentController = {
  updateAgentStatus: asyncHandler(async (req: Request, res: Response) => {
    const agentId = Number(req.params.agentId);
    const adminId = Number(req.user?.userId);

    if (isNaN(agentId) || isNaN(adminId))
      sendError(res, 'Invalid agent or admin ID', StatusCodes.BAD_REQUEST);

    const data = await adminAgentService.updateAgentStatus(
      agentId,
      req.body,
      adminId,
    );

    sendSuccess(res, {}, data.message, StatusCodes.OK);
  }),

  updateAgentFinance: asyncHandler(async (req: Request, res: Response) => {
    const agentId = Number(req.params.agentId);
    const adminId = Number(req.user?.userId);
    const requestingUser = req.user as JWTAccessTokenType;

    if (isNaN(agentId) || isNaN(adminId))
      sendError(res, 'Invalid agent or admin ID', StatusCodes.BAD_REQUEST);

    const data = await adminAgentService.updateAgentFinance(
      req.body as UpdateAgentFinanceFormType,
      agentId,
      adminId,
      requestingUser,
    );

    sendSuccess(
      res,
      data,
      'Agent finance updated successfully',
      StatusCodes.OK,
    );
  }),
};
