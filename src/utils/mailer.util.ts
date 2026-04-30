import { render } from '@react-email/render';

import { appConfig } from '@/config/app.config';
import { transporter } from '@/config/mailer.config';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendMail = async (options: SendMailOptions) => {
  await transporter.sendMail({
    from: `"Jetrique" <${appConfig.smtpFrom}>`,
    ...options,
  });
};

// ─── Agent Approved ───
export const sendAgentApprovedEmail = async (to: string, fullName: string, commission: number) => {
  const { AgentApproved } = await import('@/emails/templates/AgentApproved');
  const html = await render(AgentApproved({ fullName, commission }));

  await sendMail({
    to,
    subject: 'Your Jetrique Agent Account Has Been Approved',
    html,
  });
};
