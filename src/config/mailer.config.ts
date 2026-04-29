import nodemailer from 'nodemailer';
import { appConfig } from './app.config';
import { logger } from './logger.config';

export const transporter = nodemailer.createTransport({
  host: appConfig.smtpHost,
  port: parseInt(appConfig.smtpPort),
  secure: true,
  auth: {
    user: appConfig.smtpUser,
    pass: appConfig.smtpPass,
  },
});

// ─── Verify Connection ───
export const verifyMailer = async () => {
  try {
    await transporter.verify();
    logger.info('Mailer connected successfully');
  } catch (error) {
    logger.error('Mailer connection failed:', error);
  }
};
