import { Section, Text, Hr, Heading, Button } from '@react-email/components';
import { BaseLayout } from '../components/BaseLayout';

interface SubAgentGreetingsEmailProps {
  subAgentName: string;
  psaName: string;
  email: string;
  password: string;
}

export const SubAgentGreetingsEmail = ({ subAgentName, psaName, email, password }: SubAgentGreetingsEmailProps) => {
  return (
    <BaseLayout preview={`Welcome to Jetrique, ${subAgentName}!`}>
      <Heading className="text-[#1B4F8A] text-xl font-bold my-4">Welcome to the Team!</Heading>

      <Text className="text-gray-700 text-base">
        Hi <strong>{subAgentName}</strong>,
      </Text>

      <Text className="text-gray-700 text-base">
        Your account has been successfully created by <strong>{psaName}</strong> as a Sub-Agent of {psaName} on the
        Jetrique platform.
      </Text>

      {/* ─── Login Credentials Box ─── */}
      <Section className="bg-[#F8FAFC] border-2 border-dashed border-[#1B4F8A] px-6 py-5 my-6 rounded-lg">
        <Text className="m-0 text-[#1B4F8A] text-sm font-bold mb-3 uppercase tracking-wider">Login Credentials</Text>

        <Text className="m-0 text-sm text-gray-700 mb-2">
          <strong>Email:</strong> {email}
        </Text>

        <Text className="m-0 text-sm text-gray-700">
          <strong>Password:</strong>{' '}
          <code style={{ backgroundColor: '#e2e8f0', padding: '2px 4px', borderRadius: '4px' }}>{password}</code>
        </Text>

        <Hr className="border-gray-200 my-4" />

        <Text className="m-0 text-[11px] text-gray-500 italic leading-tight">
          * Security Note: Please change your password immediately after your first login.
        </Text>
      </Section>

      {/* ─── Dashboard Link ─── */}
      <Section className="text-center my-6">
        <Button
          style={{
            backgroundColor: '#1B4F8A',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block',
          }}
          href={`${process.env.NEXT_PUBLIC_APP_URL}/login`}
        >
          Login to Dashboard
        </Button>
      </Section>

      <Text className="text-gray-700 text-base">
        <strong>Important:</strong>
        <br />
        Your account access is being finalized. You can use these credentials to access your dashboard as soon as you
        receive the activation notification from our team.
      </Text>

      <Hr className="border-gray-200 my-6" />

      <Text className="text-gray-600 text-sm">
        If you have any questions regarding your setup, please reach out to your PSA (<strong>{psaName}</strong>) or
        contact our support.
      </Text>

      <Text className="text-[#1B4F8A] font-bold text-base mt-4">
        Happy Booking! <br />
        The Jetrique Team
      </Text>
    </BaseLayout>
  );
};

export default SubAgentGreetingsEmail;
