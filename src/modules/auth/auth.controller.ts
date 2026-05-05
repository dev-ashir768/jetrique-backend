import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { authService } from './auth.service';
import { sendError, sendSuccess } from '@/utils/response.util';
import { JWTAccessTokenType } from '@/types';
import { StatusCodes } from 'http-status-codes';

export const authController = {
  registerAgent: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.registerAgent(req.body);
    sendSuccess(res, data, 'Registration submitted. Awaiting super admin approval.', 201);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.login(req.body);
    sendSuccess(res, data, 'Login successful');
  }),

  getMe: asyncHandler(async (req: Request, res: Response) => {
    const loggedInUser = req.user as JWTAccessTokenType;

    const data = await authService.getMe(loggedInUser);

    sendSuccess(res, data, 'User fetched successfully');
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    const { newPassword, oldPassword } = req.body;
    const loggedInUser = req.user as JWTAccessTokenType;

    if (!loggedInUser) sendError(res, 'Unauthorized', 404);

    const result = await authService.changePassword(
      {
        newPassword,
        oldPassword,
      },
      loggedInUser,
    );
    sendSuccess(res, result.data, result.message, StatusCodes.OK);
  }),

  refreshAccessToken: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.refreshAccessToken(req.body);
    sendSuccess(res, data, 'Access token refreshed successfully');
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.logout(req.body);
    sendSuccess(res, data, 'Logout successful');
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const result = await authService.forgotPassword(data);

    sendSuccess(res, result.data, result.message, StatusCodes.OK);
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const result = await authService.resetPassword(data);

    sendSuccess(res, result.data, result.message, StatusCodes.OK);
  }),
};
