export interface JWTAccessTokenType {
  userId: number;
  roleId: number;
  roleSlug: string;
}

export interface JWTRefreshTokenType {
  userId: number;
}
