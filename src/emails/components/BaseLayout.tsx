import { Body, Container, Head, Heading, Html, Preview, Section, Tailwind, Text, Hr } from '@react-email/components';

interface BaseLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export const BaseLayout = ({ preview, children }: BaseLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="max-w-[600px] mx-auto my-10">
            {/* ─── Header ─── */}
            <Section className="bg-[#1B4F8A] rounded-t-lg px-8 py-6 text-center">
              <Heading className="text-white text-3xl font-bold tracking-widest m-0">JETRIQUE</Heading>
            </Section>

            {/* ─── Body ─── */}
            <Section className="bg-white px-8 py-6">{children}</Section>

            {/* ─── Footer ─── */}
            <Section className="bg-gray-100 px-8 py-4 rounded-b-lg text-center">
              <Hr className="border-gray-200 mb-4" />
              <Text className="text-gray-400 text-xs m-0">
                © {new Date().getFullYear()} Jetrique. All rights reserved.
              </Text>
              <Text className="text-gray-400 text-xs m-0">This is an automated email. Please do not reply.</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
