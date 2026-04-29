export const appConfig = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY,
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY,
  apiPrefix: process.env.API_PREFIX,
  smtpHost: process.env.SMTP_HOST!,
  smtpPort: process.env.SMTP_PORT!,
  smtpUser: process.env.SMTP_USER!,
  smtpPass: process.env.SMTP_PASS!,
  smtpFrom: process.env.SMTP_FROM!,
};
