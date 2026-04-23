import asyncHandler from 'express-async-handler';
import { Response, Request } from 'express';
import { adminAgentService } from './admin.agent.service';
import { sendError, sendSuccess } from '@/utils/response.util';
import { StatusCodes } from 'http-status-codes';

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
};
