import asyncHandler from 'express-async-handler';
import { SubAgentService } from './sub-agent.service';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { JWTAccessTokenType } from '@/types';
import { CreateSubAgentFormType } from './sub-agent.schema';
import { sendSuccess } from '@/utils/response.util';

export const SubAgentController = {
  createSubAgent: asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body as CreateSubAgentFormType;
    const requestingUser = req.user as JWTAccessTokenType;

    const data = await SubAgentService.createSubAgent(payload, requestingUser);

    sendSuccess(
      res,
      data,
      'Sub-agent created successfully. Awaiting super admin approval.',
      StatusCodes.CREATED,
    );
  }),
};
