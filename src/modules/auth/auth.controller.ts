import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { authService } from "./auth.service";
import { sendError, sendSuccess } from "@/utils/response.util";

export const authController = {
  registerAgent: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.registerAgent(req.body);
    sendSuccess(
      res,
      data,
      "Registration submitted. Awaiting admin approval.",
      201,
    );
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.login(req.body);
    sendSuccess(res, data, "Login successful");
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { newPassword, oldPassword } = req.body;

    if (!userId) sendError(res, "Unauthorized", 404);

    const data = await authService.changePassword({
      newPassword,
      oldPassword,
      userId,
    });
    sendSuccess(
      res,
      data,
      "Password changed successfully. Please login again.",
    );
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.refreshAccessToken(req.body);
    sendSuccess(res, data, "Access token refreshed successfully");
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.logout(req.body);
    sendSuccess(res, data, "Logout successful");
  }),
};
