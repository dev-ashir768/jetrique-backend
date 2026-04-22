import asyncHandler from 'express-async-handler';
import { Response, Request } from 'express';
import { adminAgentService } from './admin.agent.service';
import { sendSuccess } from '@/utils/response.util';

export const adminAgentController = {
  // approveAgent: async (req: Request, res: Response) => {
  //   const agentId = Number(req.params.agentId);
  //   const adminId = Number(req.user?.userId);

  //   const result = await adminAgentService.approveAgent(
  //     agentId,
  //     req.body,
  //     adminId,
  //   );
  //   sendSuccess(res, result, "Agent approved successfully");
  // },

  // rejectAgent: async (req: Request, res: Response) => {
  //   const agentId = Number(req.params.agentId);
  //   const adminId = Number(req.user?.userId);

  //   const result = await adminAgentService.rejectAgent(
  //     agentId,
  //     req.body,
  //     adminId,
  //   );
  //   sendSuccess(res, result, "Agent rejected successfully");
  // },

  // suspendAgent: async (req: Request, res: Response) => {
  //   const agentId = Number(req.params.agentId);
  //   const adminId = Number(req.user?.userId);

  //   const result = await adminAgentService.suspendAgent(
  //     agentId,
  //     req.body,
  //     adminId,
  //   );
  //   sendSuccess(res, result, "Agent suspended successfully");
  // },

  agentStatusChange: asyncHandler(async (req: Request, res: Response) => {
    const agentId = Number(req.params.agentId);
    const adminId = Number(req.user?.userId);

    const data = await adminAgentService.agentStatusChange(
      agentId,
      req.body,
      adminId,
    );

    sendSuccess(res, data, 'Agent status changed successfully');
  }),
};
