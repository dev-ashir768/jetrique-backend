import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { agentService } from './agent.service';
import { sendSuccess } from '@/utils/response.util';

export const agentController = {
  getAgentById: asyncHandler(async (req: Request, res: Response) => {
    const agent = await agentService.getAgentById(req.user!.userId!);

    sendSuccess(res, agent, 'Agent fetched successfully', 200);
  }),
};
