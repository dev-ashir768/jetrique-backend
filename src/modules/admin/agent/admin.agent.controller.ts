import asyncHandler from 'express-async-handler';
import { Response, Request } from 'express';
import { adminAgentService } from './admin.agent.service';
import { sendSuccess } from '@/utils/response.util';
import { StatusCodes } from 'http-status-codes';

export const adminAgentController = {
  agentStatusChange: asyncHandler(async (req: Request, res: Response) => {
    const agentId = Number(req.params.agentId);
    const adminId = Number(req.user?.userId);

    const data = await adminAgentService.agentStatusChange(
      agentId,
      req.body,
      adminId,
    );

    sendSuccess(res, data, 'Agent status changed successfully', StatusCodes.OK);
  }),
};
