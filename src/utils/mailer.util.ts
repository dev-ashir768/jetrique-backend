import { render } from '@react-email/render';

import { appConfig } from '@/config/app.config';
import { transporter } from '@/config/mailer.config';
import { logger } from '@/config/logger.config';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendMail = async (options: SendMailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"Jetrique" <${appConfig.smtpFrom}>`,
      ...options,
    });
    logger.info(`Email Sent: To=${options.to} | Subject="${options.subject}" | MessageId=${info.messageId}`);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Email Failed: To=${options.to} | Error=${(error as Error).message}`);
    return { success: false, error: (error as Error).message };
  }
};

// ─── Agent Creation Greetings ───
export const sendAgentCreationGreetings = async (to: string, fullName: string, role: string) => {
  const { AgentGreetingsEmail } = await import('@/emails/templates/AgentGreetingsEmail');
  const html = await render(AgentGreetingsEmail({ fullName, role }));

  await sendMail({
    to,
    subject: 'Welcome to Jetrique - Registration Received!',
    html,
  });
};

// ─── Sub Agent Creation Greetings ───
export const sendSubAgentCreationGreetings = async (to: string, psaName: string, subAgentName: string, email: string, password: string) => {
  const { SubAgentGreetingsEmail } = await import('@/emails/templates/SubAgentGreetingsEmail');
  const html = await render(SubAgentGreetingsEmail({ psaName, subAgentName, email, password }));

  await sendMail({
    to,
    subject: 'Welcome to Jetrique - Registration Received!',
    html,
  });
};
