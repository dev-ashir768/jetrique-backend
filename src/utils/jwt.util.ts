import jwt, { SignOptions } from 'jsonwebtoken';
import { appConfig } from '@/config/app.config';
import { JWTAccessTokenType, JWTRefreshTokenType } from '@/types';

export const generateAccessToken = (payload: JWTAccessTokenType) => {
  return jwt.sign(payload, appConfig.jwtAccessSecret!, {
    expiresIn: appConfig.jwtAccessExpiry as SignOptions['expiresIn'],
  });
};

export const generateRefreshToken = (payload: JWTRefreshTokenType) => {
  return jwt.sign(payload, appConfig.jwtRefreshSecret!, {
    expiresIn: appConfig.jwtRefreshExpiry as SignOptions['expiresIn'],
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, appConfig.jwtAccessSecret!);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, appConfig.jwtRefreshSecret!);
};
