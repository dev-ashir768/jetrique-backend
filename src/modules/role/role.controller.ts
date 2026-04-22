import asyncHandler from 'express-async-handler';
import { roleService } from './role.service';
import { sendSuccess } from '@/utils/response.util';
import { Response, Request } from 'express';

export const roleController = {
  getAllRoles: asyncHandler(async (_req: Request, res: Response) => {
    const roles = await roleService.getAllRoles();
    sendSuccess(res, roles, 'Roles fetched successfully', 200);
  }),
};
