import { Section, Text, Hr, Heading, Button } from '@react-email/components';
import { BaseLayout } from '../components/BaseLayout';

interface ResetPasswordEmailProps {
  fullName: string;
  resetLink: string;
  expiryMinutes?: number;
}

export const ResetPasswordEmail = ({ fullName, resetLink, expiryMinutes = 15 }: ResetPasswordEmailProps) => {
  return (
    <BaseLayout preview="Reset your Jetrique password">
      <Heading className="text-[#1B4F8A] text-xl font-bold my-4">Password Reset Request</Heading>

      <Text className="text-gray-700 text-base">
        Hello <strong>{fullName}</strong>,
      </Text>

      <Text className="text-gray-700 text-base">
        Humein aapke account ke liye password reset ki request mili hai. Naya password set karne ke liye niche diye gaye
        button par click karein:
      </Text>

      {/* ─── Action Button ─── */}
      <Section className="text-center my-8">
        <Button className="bg-[#1B4F8A] text-white px-6 py-3 rounded font-bold text-sm no-underline" href={resetLink}>
          Reset Password
        </Button>
      </Section>

      {/* ─── Security Note ─── */}
      <Section className="bg-[#F8F9FA] border-l-4 border-[#1B4F8A] px-5 py-4 my-6 rounded">
        <Text className="m-0 text-sm text-gray-800">
          <strong>Security Note:</strong> Yeh link <strong>{expiryMinutes} minutes</strong> mein expire ho jayega.
        </Text>
        <Text className="m-0 text-xs text-gray-600 mt-1">
          Agar aap ne yeh request nahi ki, toh aap is email ko ignore kar sakte hain. Aapka password tab tak change nahi
          hoga jab tak aap upar diye gaye link par click karke naya password set nahi karte.
        </Text>
      </Section>

      <Text className="text-gray-600 text-sm italic">
        Agar button kaam nahi kar raha, toh niche diye gaye URL ko copy karke browser mein paste karein:
        <br />
        <span className="text-[#1B4F8A] break-all">{resetLink}</span>
      </Text>

      <Hr className="border-gray-200 my-6" />

      <Text className="text-[#1B4F8A] font-bold text-base mt-4">
        Best Regards, <br />
        The Jetrique Team
      </Text>
    </BaseLayout>
  );
};

export default ResetPasswordEmail;
