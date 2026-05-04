import asyncHandler from 'express-async-handler';
import { Response, Request } from 'express';
import { agentService } from './agent.service';
import { sendError, sendSuccess } from '@/utils/response.util';
import { StatusCodes } from 'http-status-codes';
import { CreateSubAgentFormType, GetAgentsFormType, UpdateAgentFinanceFormType } from './agent.schema';
import { JWTAccessTokenType } from '@/types';

export const agentController = {
  // ─── Get Agents ───
  getAgents: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as GetAgentsFormType;
    const loggedInUser = req.user as JWTAccessTokenType;

    const data = await agentService.getAgents(query, loggedInUser);

    sendSuccess(res, data.agents, 'Agents Fetched Successfully', StatusCodes.OK, data.meta);
  }),

  // ─── Get Agent by Id ───
  getAgentById: asyncHandler(async (req: Request, res: Response) => {
    const agentId = Number(req.params.agentId);
    const loggedInUser = req.user as JWTAccessTokenType;

    if (isNaN(agentId)) sendError(res, 'Invalid agent ID', StatusCodes.BAD_REQUEST);

    const data = await agentService.getAgentById(agentId, loggedInUser);

    sendSuccess(res, data, 'Agent Fetched Successfully', StatusCodes.OK);
  }),

  // ─── Update Agent Status ───
  updateAgentStatus: asyncHandler(async (req: Request, res: Response) => {
    const agentId = Number(req.params.agentId);
    const adminId = Number(req.user?.userId);

    if (isNaN(agentId) || isNaN(adminId)) sendError(res, 'Invalid agent or admin ID', StatusCodes.BAD_REQUEST);

    const data = await agentService.updateAgentStatus(agentId, req.body, adminId);

    sendSuccess(res, {}, data.message, StatusCodes.OK);
  }),

  // ─── Update Agent Finance ───
  updateAgentFinance: asyncHandler(async (req: Request, res: Response) => {
    const agentId = Number(req.params.agentId);
    const loggedInUser = req.user as JWTAccessTokenType;

    if (isNaN(agentId) || isNaN(loggedInUser?.userId)) sendError(res, 'Invalid agent or admin ID', StatusCodes.BAD_REQUEST);

    const data = await agentService.updateAgentFinance(
      req.body as UpdateAgentFinanceFormType,
      agentId,
      loggedInUser,
    );

    sendSuccess(res, data, 'Agent finance updated successfully', StatusCodes.OK);
  }),

  // ─── Create Sub Agent ───
  createSubAgent: asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body as CreateSubAgentFormType;
    const loggedInUser = req.user as JWTAccessTokenType;

    const data = await agentService.createSubAgent(payload, loggedInUser);

    sendSuccess(res, data.agentId, data.message, StatusCodes.CREATED);
  }),
};
