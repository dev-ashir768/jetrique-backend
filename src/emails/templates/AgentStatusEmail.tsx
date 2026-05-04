import { Hr, Section, Text } from "@react-email/components";
import { BaseLayout } from "../components/BaseLayout";
import { AgentStatus } from "@prisma/client";

interface AgentStatusProps {
  fullName: string;
  status: AgentStatus;
  commission?: number;
  paymentType?: string;
  reason?: string;
}

export const AgentStatusEmail = ({ fullName, status, commission, paymentType, reason }: AgentStatusProps) => {
  const isApproved = status === 'APPROVED';

  return (
    <BaseLayout preview={isApproved ? "Account Approved" : "Account Status Update"}>
      <Text>Dear <strong>{fullName}</strong>,</Text>

      {isApproved ? (
        // ─── APPROVED VIEW ───
        <>
          <Text>Congratulations! Your account has been <strong style={{ color: '#27ae60' }}>approved</strong>.</Text>
          <Section className="bg-[#F0F5FA] border-l-4 border-[#1B4F8A] px-5 py-4 my-4 rounded">
            <Text className="m-0 text-sm"><strong>Commission:</strong> {commission}%</Text>
            <Text className="m-0 text-sm"><strong>Payment Type:</strong> {paymentType}</Text>
          </Section>
          <Text>You can now login to your dashboard.</Text>
        </>
      ) : (
        // ─── REJECTED VIEW ───
        <>
          <Text>We regret to inform you that your application has been <strong style={{ color: '#e74c3c' }}>rejected</strong>.</Text>
          {reason && (
            <Section className="bg-[#FEF2F2] border-l-4 border-[#e74c3c] px-5 py-4 my-4 rounded">
              <Text className="m-0 text-sm text-red-700"><strong>Reason:</strong> {reason}</Text>
            </Section>
          )}
          <Text>If you have any questions, please contact our support team.</Text>
        </>
      )}

      <Hr className="my-4" />
      <Text>Best Regards, <br/> Jetrique Team</Text>
    </BaseLayout>
  );
};