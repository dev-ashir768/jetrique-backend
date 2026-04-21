import { NextFunction, Request, Response } from "express";
import { sendError } from "@utils/response.util";
import { verifyAccessToken } from "@/utils/jwt.util";
import { JWTAccessTokenType } from "@/types";

export const authMiddleware = {
  verifyAccessToken: (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Access token not found", 401);
    }

    const accessToken = authHeader.split(" ")[1];

    try {
      const decoded = verifyAccessToken(accessToken);
      req.user = decoded as JWTAccessTokenType;
      next();
    } catch (error) {
      return sendError(res, "Invalid or expired access token", 401);
    }
  },

  authorize:
    (allowedRoles: string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
      const userRole = req.user?.roleSlug;

      if (!userRole) {
        return sendError(res, "Unauthorized", 401);
      }

      if (!allowedRoles.includes(userRole)) {
        return sendError(res, "Forbidden — You do not have access", 403);
      }

      next();
    },
};
