import { Section, Text, Hr, Heading } from '@react-email/components';
import { BaseLayout } from '../components/BaseLayout';

interface AgentGreetingsEmailProps {
  fullName: string;
  role: string;
}

export const AgentGreetingsEmail = ({ fullName, role }: AgentGreetingsEmailProps) => {
  return (
    <BaseLayout preview="Welcome to Jetrique - Registration Received!">
      <Heading className="text-[#1B4F8A] text-xl font-bold my-4">Hello {fullName},</Heading>

      <Text className="text-gray-700 text-base">
        Thank you for choosing <strong className="text-[#1B4F8A]">Jetrique</strong>! We are excited to have you start
        your journey as a <strong className="text-[#1B4F8A]">{role}</strong>.
      </Text>

      <Text className="text-gray-700 text-base">
        This is a quick confirmation to let you know that we have successfully received your registration details.
      </Text>

      {/* ─── Status Box ─── */}
      <Section className="bg-[#FFF9E6] border-l-4 border-[#F39C12] px-5 py-4 my-6 rounded">
        <Text className="m-0 text-sm text-gray-800">
          <strong>Current Status:</strong> Pending
        </Text>
        <Text className="m-0 text-xs text-gray-600 mt-1">
          Our team typically reviews new applications within 24-48 business hours.
        </Text>
      </Section>

      <Text className="text-gray-700 text-base">
        Once your account is verified and approved, you will receive email with commission structure and payment type.
      </Text>

      <Hr className="border-gray-200 my-6" />

      <Text className="text-gray-600 text-sm">
        If you have any questions in the meantime, feel free to reply to this email or contact our support team.
      </Text>

      <Text className="text-[#1B4F8A] font-bold text-base mt-4">
        Best Regards, <br />
        The Jetrique Team
      </Text>
    </BaseLayout>
  );
};

export default AgentGreetingsEmail;
