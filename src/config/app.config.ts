export const appConfig = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRY,
  apiPrefix: process.env.API_PREFIX,
};
