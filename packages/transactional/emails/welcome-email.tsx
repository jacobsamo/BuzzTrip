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

interface WelcomeEmailProps {
  email: string;
  firstName: string;
}

const WelcomeEmail = (props: WelcomeEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>
          Welcome to BuzzTrip! Let's start creating amazing custom maps together
          🗺️
        </Preview>
        <Body className="bg-[#F5F3E5] font-sans py-[40px]">
          <Container className="bg-[#fffff6] max-w-[600px] mx-auto rounded-[12px] overflow-hidden shadow-lg">
            {/* Header with Logo */}

            {/* Main Content */}
            <Section className="px-[40px] py-[40px]">
              <Img
                src="https://di867tnz6fwga.cloudfront.net/brand-kits/5c37fc6e-f7cf-42bd-9edb-2b116f9c8cd8/primary/e79aab6e-3705-411e-8375-afbf42103906.png"
                alt="BuzzTrip Logo"
                className="w-full size-24 mx-auto rounded-full"
              />
              <Heading className="text-[32px] font-bold text-[#04131B] mb-[24px] text-center leading-[1.2]">
                Welcome to BuzzTrip! 🎉
              </Heading>

              <Text className="text-[18px] text-[#04131B] mb-[24px] leading-[1.6] text-center">
                Hey there, map explorer! 👋
              </Text>

              <Text className="text-[16px] text-[#04131B] mb-[24px] leading-[1.6]">
                I'm Jacob Samorowski, the founder of BuzzTrip,
                and I'm absolutely thrilled to welcome you to our community of
                creative map makers!
              </Text>

              <Text className="text-[16px] text-[#04131B] mb-[24px] leading-[1.6]">
                You've just joined something pretty special – a platform where
                you can create custom maps anywhere, anytime, on any device. 
                Whether you're planning your next adventure, mapping out your
                favorite local spots, or creating something entirely unique,
                BuzzTrip is here to make it happen! ✨
              </Text>

              <Text className="text-[16px] text-[#04131B] mb-[32px] leading-[1.6]">
                Ready to dive in? Here's what you can do right now:
              </Text>

              {/* Feature Highlights */}
              <Section className="bg-[#F5F3E5] rounded-[12px] p-[24px] mb-[32px]">
                <Row>
                  <Column className="w-[40px]">
                    <Text className="text-[20px]">🗺️</Text>
                  </Column>
                  <Column>
                    <Text className="text-[16px] text-[#04131B] font-semibold">
                      Create your first custom map in minutes
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-[40px]">
                    <Text className="text-[20px]">📍</Text>
                  </Column>
                  <Column>
                    <Text className="text-[16px] text-[#04131B] font-semibold">
                      Add your favorite places and memories
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-[40px]">
                    <Text className="text-[20px]">🎨</Text>
                  </Column>
                  <Column>
                    <Text className="text-[16px] text-[#04131B] font-semibold">
                      Customize colors, styles, and themes
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-[40px]">
                    <Text className="text-[20px]">📱</Text>
                  </Column>
                  <Column>
                    <Text className="text-[#04131B] font-semibold">
                      Access your maps from any device
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* CTA Button */}
              <Section className="text-center mb-[32px]">
                <Button
                  href="https://buzztrip.co/app"
                  className="bg-[#2C7873] text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold box-border inline-block hover:bg-[#1f5a56] transition-colors"
                >
                  Start Creating Maps Now 🚀
                </Button>
              </Section>

              <Text className="text-[16px] text-[#04131B] mb-[24px] leading-[1.6]">
                If you have any questions or just want to share what you're
                building, don't hesitate to reach out. I love hearing from our
                community and seeing the amazing maps you create!
              </Text>

              <Text className="text-[16px] text-[#04131B] mb-[8px] leading-[1.6]">
                Happy mapping! 🗺️✨
              </Text>

              <Text className="text-[16px] text-[#04131B] font-semibold">
                Jacob Samorowski
                <br />
                Founder, BuzzTrip
              </Text>
            </Section>

            {/* Social Links */}
            <Section className="px-[40px] py-[24px] border-t border-solid border-[#F5F3E5]">
              <Text className="text-[14px] text-[#04131B] mb-[16px] text-center font-semibold">
                Follow us for mapping tips and updates:
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
                <strong>BuzzTrip</strong> - Create Custom Maps - Anywhere,
                Anytime, On Any Device
              </Text>
        
              {/* <Text className="text-[12px] text-[#04131B] mb-[8px] m-0">
                <Link
                  href="https://buzztrip.co"
                  className="text-[#2C7873] underline"
                >
                  Unsubscribe
                </Link>
              </Text> */}
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

export default WelcomeEmail;
