import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface MagicLinkVerificationEmailProps {
  email: string;
  token: string;
  callbackUrl: string;
}

const MagicLinkVerificationEmail = ({
  email = "test@test.com",
  token = "xxxxxx",
  callbackUrl = "https://localhost:8181/auth/sign-in/verify?token=xxxxxx",
}: MagicLinkVerificationEmailProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Preview>Your verification code: {token} - BuzzTrip</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-[40px] bg-white p-[20px] rounded-[8px] shadow-sm max-w-[600px]">
            <Section>
              <Heading className="text-[24px] font-bold text-gray-800 my-[16px]">
                Verify your BuzzTrip account
              </Heading>
              <Text className="text-[16px] text-gray-600 mb-[24px]">
                Thanks for signing in to BuzzTrip. Use the verification code
                below or click the magic link to complete your account setup.
              </Text>

              {/* OTP Code Section */}
              <Section className="bg-gray-50 p-[24px] rounded-[8px] text-center mb-[24px]">
                <Text className="text-[14px] text-gray-600 mb-[8px]">
                  Your verification code:
                </Text>
                <Heading className="text-[32px] font-bold tracking-[4px] text-[#2C7873] my-[8px]">
                  {token}
                </Heading>
                <Text className="text-[14px] text-gray-500">
                  This code will expire in 10 minutes.
                </Text>
              </Section>

              {/* Magic Link Section */}
              <Text className="text-[16px] text-gray-600 mb-[16px]">
                Or simply click the button below to verify your account
                instantly:
              </Text>
              <Button
                className="bg-blue-600 text-white py-[12px] px-[24px] rounded-[8px] font-medium text-[16px] no-underline text-center block box-border"
                href={callbackUrl}
              >
                Verify My Account
              </Button>

              <Text className="text-[14px] text-gray-500 mt-[24px]">
                If the button doesn't work, copy and paste this link into your
                browser:
              </Text>
              <Text className="text-[14px] text-blue-600 break-all mb-[24px]">
                <Link href={callbackUrl} className="text-blue-600 no-underline">
                  {callbackUrl}
                </Link>
              </Text>

              <Hr className="border-gray-200 my-[24px]" />

              <Text className="text-[14px] text-gray-500">
                If you didn't request this verification, you can safely ignore
                this email.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="mt-[32px] text-center text-gray-500 text-[12px]">
              <Text className="m-0">
                &copy; {currentYear} BuzzTrip. All rights reserved.
              </Text>
              <Text className="mt-[8px]">
                <Link
                  href="https://buzztrip.co/legal/privacy"
                  className="text-gray-500 underline"
                >
                  Privacy Policy
                </Link>
                {" • "}
                <Link
                  href="https://buzztrip.co/legal/terms"
                  className="text-gray-500 underline"
                >
                  Terms of Service
                </Link>
                {" • "}
                {/* <Link href="https://buzztrip.co/unsubscribe" className="text-gray-500 underline">
                  Unsubscribe
                </Link> */}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MagicLinkVerificationEmail;
