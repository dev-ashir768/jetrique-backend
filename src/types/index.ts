export interface JWTAccessTokenType {
  userId: number;
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
