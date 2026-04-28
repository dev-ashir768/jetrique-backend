import asyncHandler from 'express-async-handler';
import { Response, Request } from 'express';
import { agentService } from './agent.service';
import { sendError, sendSuccess } from '@/utils/response.util';
import { StatusCodes } from 'http-status-codes';
import { GetAgentsFormType } from './agent.schema';
import { JWTAccessTokenType } from '@/types';

export const agentController = {
  getAgents: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as GetAgentsFormType;
    const requestingUser = req.user as JWTAccessTokenType;

    const data = await agentService.getAgents(query, requestingUser);

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
    const requestingUser = req.user as JWTAccessTokenType;

    if (isNaN(agentId))
      sendError(res, 'Invalid agent ID', StatusCodes.BAD_REQUEST);

    const data = await agentService.getAgentById(agentId, requestingUser);

    sendSuccess(res, data, 'Agent Fetched Successfully', StatusCodes.OK);
  }),
};
