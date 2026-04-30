import { Section, Text, Hr } from '@react-email/components';
import { BaseLayout } from '../components/BaseLayout';

interface AgentApprovedProps {
  fullName: string;
  commission: number;
}

export const AgentApproved = ({ fullName, commission }: AgentApprovedProps) => {
  return (
    <BaseLayout preview="Your Jetrique Agent Account Has Been Approved">
      <Text className="text-gray-700 text-base">
        Dear <strong>{fullName}</strong>,
      </Text>

      <Text className="text-gray-700 text-base">
        Congratulations! Your agent account has been <strong style={{ color: '#27ae60' }}>approved</strong> by Jetrique.
      </Text>

      {/* ─── Commission Box ─── */}
      <Section className="bg-[#F0F5FA] border-l-4 border-[#1B4F8A] px-5 py-4 my-4 rounded">
        <Text className="m-0 text-sm text-gray-700">
          <strong>Commission Rate:</strong> {commission}%
        </Text>
      </Section>

      <Text className="text-gray-700 text-base">You can now login to your dashboard and start booking flights.</Text>

      <Hr className="border-gray-200 my-4" />

      <Text className="text-gray-700 text-base">Welcome aboard!</Text>
    </BaseLayout>
  );
};

export default AgentApproved;
