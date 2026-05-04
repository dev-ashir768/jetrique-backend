import asyncHandler from 'express-async-handler';
import { roleService } from './role.service';
import { sendSuccess } from '@/utils/response.util';
import { LoggedInUser } from '@/types';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

export const roleController = {
  getAllRoles: asyncHandler(async (req: Request, res: Response) => {
    const loggedInUser = req.user as LoggedInUser;

    const roles = await roleService.getAllRoles(loggedInUser);
    sendSuccess(res, roles, 'Roles fetched successfully', StatusCodes.OK);
  }),

  getRoleLookup: asyncHandler(async (_req: Request, res: Response) => {
    const result = await roleService.getRoleLookup();
    sendSuccess(res, result.data, result.message, StatusCodes.OK);
  }),
};
