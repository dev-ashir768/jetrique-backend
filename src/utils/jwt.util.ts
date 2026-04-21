import jwt from "jsonwebtoken";
import { appConfig } from "@/config/app.config";

export const generateAccessToken = (userId: number, roleId: number, roleSlug: string, agentId: number | null) => {
  return jwt.sign({ userId, roleId, roleSlug, agentId }, appConfig.jwtAccessSecret!, {
    expiresIn: appConfig.jwtAccessExpiry as any,
  });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({userId}, appConfig.jwtRefreshSecret!, {
    expiresIn: appConfig.jwtRefreshExpiry as any,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, appConfig.jwtAccessSecret!);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, appConfig.jwtRefreshSecret!);
};