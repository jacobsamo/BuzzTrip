import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface BetaWelcomeEmailProps {
  email: string;
  firstName?: string;
  whatsappLink: string;
}

const BetaWelcomeEmail = (props: BetaWelcomeEmailProps) => {
  const { firstName = "there", whatsappLink } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>
          Welcome to BuzzTrip Beta! Join our community and help shape the
          future of custom mapping 🗺️✨
        </Preview>
        <Body className="bg-[#F5F3E5] font-sans py-[40px]">
          <Container className="bg-[#fffff6] max-w-[600px] mx-auto rounded-[12px] overflow-hidden shadow-lg">
            {/* Main Content */}
            <Section className="px-[40px] py-[40px]">
              <Img
                src="https://di867tnz6fwga.cloudfront.net/brand-kits/5c37fc6e-f7cf-42bd-9edb-2b116f9c8cd8/primary/e79aab6e-3705-411e-8375-afbf42103906.png"
                alt="BuzzTrip Logo"
                className="w-full size-24 mx-auto rounded-full"
              />
              <Heading className="text-[32px] font-bold text-[#04131B] mb-[24px] text-center leading-[1.2]">
                Welcome to BuzzTrip Beta! 🎉
              </Heading>

              <Text className="text-[18px] text-[#04131B] mb-[24px] leading-[1.6] text-center">
                Hey {firstName}! 👋
              </Text>

              <Text className="text-[16px] text-[#04131B] mb-[24px] leading-[1.6]">
                I'm Jacob Samorowski, founder of BuzzTrip, and I'm{" "}
                <strong>absolutely thrilled</strong> to welcome you to our
                exclusive beta program!
              </Text>

              <Text className="text-[16px] text-[#04131B] mb-[24px] leading-[1.6]">
                You're now part of a select group helping to shape the future of
                custom mapping. Your feedback, ideas, and early testing will
                directly influence how BuzzTrip evolves. This is{" "}
                <strong>your platform</strong>, and I can't wait to build it
                with you! ✨
              </Text>

              <Text className="text-[16px] text-[#04131B] mb-[32px] leading-[1.6] font-semibold">
                As a beta member, here's what you can expect:
              </Text>

              {/* What to Expect Section */}
              <Section className="bg-[#F5F3E5] rounded-[12px] p-[24px] mb-[32px]">
                <Row>
                  <Column className="w-[40px]">
                    <Text className="text-[20px]">🚀</Text>
                  </Column>
                  <Column>
                    <Text className="text-[16px] text-[#04131B] font-semibold">
                      Early access to new features before anyone else
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-[40px]">
                    <Text className="text-[20px]">💬</Text>
                  </Column>
                  <Column>
                    <Text className="text-[16px] text-[#04131B] font-semibold">
                      Direct line to me and the team for feedback and support
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-[40px]">
                    <Text className="text-[20px]">🎯</Text>
                  </Column>
                  <Column>
                    <Text className="text-[16px] text-[#04131B] font-semibold">
                      Help shape product decisions and roadmap priorities
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-[40px]">
                    <Text className="text-[20px]">🎁</Text>
                  </Column>
                  <Column>
                    <Text className="text-[16px] text-[#04131B] font-semibold">
                      Exclusive perks and recognition for beta contributors
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* WhatsApp CTA Section */}
              <Section className="bg-gradient-to-r from-[#25D366]/10 to-[#25D366]/5 rounded-[12px] p-[24px] mb-[32px] border-2 border-[#25D366]">
                <Text className="text-[18px] text-[#04131B] font-bold mb-[16px] text-center">
                  Join Our Beta Community! 💚
                </Text>
                <Text className="text-[16px] text-[#04131B] mb-[20px] leading-[1.6] text-center">
                  Connect with other beta testers, share feedback, get instant
                  support, and be the first to know about new features.
                </Text>
                <Section className="text-center">
                  <Button
                    href={whatsappLink}
                    className="bg-[#25D366] text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold box-border inline-block hover:bg-[#20BA5A] transition-colors"
                  >
                    Join WhatsApp Beta Group 💬
                  </Button>
                </Section>
              </Section>

              {/* Get Started Section */}
              <Text className="text-[16px] text-[#04131B] mb-[24px] leading-[1.6] font-semibold">
                Ready to start creating?
              </Text>

              <Section className="text-center mb-[32px]">
                <Button
                  href="https://buzztrip.co/app"
                  className="bg-[#2C7873] text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold box-border inline-block hover:bg-[#1f5a56] transition-colors"
                >
                  Start Creating Maps Now 🗺️
                </Button>
              </Section>

              <Text className="text-[16px] text-[#04131B] mb-[24px] leading-[1.6]">
                Your input matters tremendously. Don't hesitate to reach out
                with questions, ideas, or just to share what you're building. I
                personally read every message from our beta community!
              </Text>

              <Text className="text-[16px] text-[#04131B] mb-[8px] leading-[1.6]">
                Let's build something amazing together! 🚀
              </Text>

              <Text className="text-[16px] text-[#04131B] font-semibold">
                Jacob Samorowski
                <br />
                Founder, BuzzTrip
                <br />
                jacob.samorowski@buzztrip.co
              </Text>
            </Section>

            {/* Social Links */}
            <Section className="px-[40px] py-[24px] border-t border-solid border-[#F5F3E5]">
              <Text className="text-[14px] text-[#04131B] mb-[16px] text-center font-semibold">
                Follow us for updates and mapping tips:
              </Text>
              <Section className="text-center">
                <Link
                  href="https://links.buzztrip.co/twitter"
                  className="inline-block mx-1"
                >
                  <Img
                    src="https://new.email/static/emails/social/social-x.png"
                    alt="X (Twitter)"
                    className="size-8"
                  />
                </Link>
                <Link
                  href="https://links.buzztrip.co/bluesky"
                  className="inline-block mx-1"
                >
                  <Img
                    src="https://new.email/static/emails/social/social-bluesky.png"
                    alt="Bluesky"
                    className="size-8"
                  />
                </Link>
                <Link
                  href="https://links.buzztrip.co/instagram"
                  className="inline-block mx-1"
                >
                  <Img
                    src="https://new.email/static/emails/social/social-instagram.png"
                    alt="Instagram"
                    className="size-8"
                  />
                </Link>
                <Link
                  href="https://links.buzztrip.co/linkedin"
                  className="inline-block mx-1"
                >
                  <Img
                    src="https://new.email/static/emails/social/social-linkedin.png"
                    alt="LinkedIn"
                    className="size-8"
                  />
                </Link>
                <Link
                  href="https://git.new/buzztrip"
                  className="inline-block mx-1"
                >
                  <Img
                    src="https://new.email/static/emails/social/social-github.png"
                    alt="GitHub"
                    className="size-8"
                  />
                </Link>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="px-[40px] py-[24px] bg-[#F5F3E5] text-center">
              <Text className="text-[12px] text-[#04131B]">
                <strong>BuzzTrip Beta Program</strong> - You're part of
                something special!
              </Text>
              <Text className="text-[12px] text-[#04131B] m-0">
                © 2025 BuzzTrip
              </Text>
              <Text className="">
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
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default BetaWelcomeEmail;
