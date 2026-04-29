import asyncHandler from 'express-async-handler';
import { PermissionService } from './permission.service';
import { GetPermissionsFormType } from './permission.schema';
import { Request, Response } from 'express';
import { JWTAccessTokenType } from '@/types';
import { sendSuccess } from '@/utils/response.util';
import { StatusCodes } from 'http-status-codes';

export const PermissionController = {
  // ─── Get Permissions ───
  getPermissions: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as GetPermissionsFormType;
    const loggedInUser = req.user as JWTAccessTokenType;

    const data = await PermissionService.getPermissions(query, loggedInUser);

    sendSuccess(res, data.permission, 'Permissions fetched successfully', StatusCodes.OK, data.meta);
  }),
};
