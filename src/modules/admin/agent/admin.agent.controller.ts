import asyncHandler from 'express-async-handler';
import { Response, Request } from 'express';
import { adminAgentService } from './admin.agent.service';
import { sendError, sendSuccess } from '@/utils/response.util';
import { StatusCodes } from 'http-status-codes';
import { GetAgentsFormType, UpdateAgentFinanceFormType } from './admin.agent.schema';

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

  getAgents: asyncHandler(async (req: Request, res: Response) => {
    const data = await adminAgentService.getAgents(
      req.query as GetAgentsFormType,
    );

    sendSuccess(
      res,
      data.agents,
      'Agents Fetched Successfully',
      StatusCodes.OK,
      data.meta,
    );
  }),

  getAgentById: asyncHandler(async (req: Request, res: Response) => {
    const agentId = Number(req.params.agentId);

    if (isNaN(agentId))
      sendError(res, 'Invalid agent ID', StatusCodes.BAD_REQUEST);

    const data = await adminAgentService.getAgentById(agentId);

    sendSuccess(res, data, 'Agent Fetched Successfully', StatusCodes.OK);
  }),

  updateAgentFinance: asyncHandler(async (req: Request, res: Response) => {
    const agentId = Number(req.params.agentId);
    const adminId = Number(req.user?.userId);

    if (isNaN(agentId) || isNaN(adminId))
      sendError(res, 'Invalid agent or admin ID', StatusCodes.BAD_REQUEST);

    const data = await adminAgentService.updateAgentFinance(
      req.body as UpdateAgentFinanceFormType,
      agentId,
      adminId,
    );

    sendSuccess(res, data, 'Agent finance updated successfully', StatusCodes.OK);
  }),
};
