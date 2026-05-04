import { JwtPayload } from 'jsonwebtoken';

export interface JWTAccessTokenType extends JwtPayload {
  userId: number;
  agentId: number | null;
  roleId: number;
  roleSlug: string;
}

export interface JWTRefreshTokenType {
  userId: number;
}

export const enum ValidationSource {
  BODY = 'body',
  PARAMS = 'params',
  QUERY = 'query',
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type LoggedInUser = JWTAccessTokenType;
