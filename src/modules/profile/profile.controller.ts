import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { profileService } from './profile.service';
import { LoggedInUser } from '@/types';
import { UpdateProfileFormType } from './profile.schema';
import { sendSuccess } from '@/utils/response.util';
import { StatusCodes } from 'http-status-codes';

export const profileController = {
  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as UpdateProfileFormType;
    const loggedInUser = req.user as LoggedInUser;
    const data = await profileService.updateProfile(body, loggedInUser);

    sendSuccess(res, data, 'Profile updated successfully', StatusCodes.OK);
  }),
};
