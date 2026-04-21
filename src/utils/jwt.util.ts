import jwt from "jsonwebtoken";
import { appConfig } from "@/config/app.config";
import { JWTAccessTokenType, JWTRefreshTokenType } from "@/types";

export const generateAccessToken = (payload: JWTAccessTokenType) => {
  return jwt.sign(payload, appConfig.jwtAccessSecret!, {
    expiresIn: appConfig.jwtAccessExpiry as any,
  });
};

export const generateRefreshToken = (payload: JWTRefreshTokenType) => {
  return jwt.sign(payload, appConfig.jwtRefreshSecret!, {
    expiresIn: appConfig.jwtRefreshExpiry as any,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, appConfig.jwtAccessSecret!);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, appConfig.jwtRefreshSecret!);
};
