import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ContactUsEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

const ContactUsEmail = ({
  firstName,
  lastName,
  email,
  subject,
  message,
}: ContactUsEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        New contact form submission from {firstName} {lastName}
      </Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="max-w-[600px] mx-auto">
            {/* Header */}
            <Section className="bg-[#2C7772] p-[20px] rounded-t-[8px]">
              <Row>
                <Column>
                  <Text className="text-[24px] font-bold text-white m-0">
                    BuzzTrip
                  </Text>
                  <Text className="text-[16px] text-white m-0">
                    Custom Mapping Application
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Content */}
            <Section className="bg-white p-[32px] rounded-b-[8px]">
              <Heading className="text-[24px] font-bold text-[#2C7772] mb-[16px]">
                New Contact Form Submission
              </Heading>

              <Text className="text-[16px] mb-[24px] text-gray-700">
                You have received a new message from your website contact form.
              </Text>

              <Section className="mb-[24px] border-solid border-[1px] border-gray-200 rounded-[8px] p-[16px]">
                <Row className="mb-[12px]">
                  <Column className="w-[120px]">
                    <Text className="text-[14px] font-bold text-gray-600 m-0">
                      Name:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-[14px] text-gray-800 m-0">
                      {firstName} {lastName}
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-[12px]">
                  <Column className="w-[120px]">
                    <Text className="text-[14px] font-bold text-gray-600 m-0">
                      Email:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-[14px] text-gray-800 m-0">
                      {email}
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-[12px]">
                  <Column className="w-[120px]">
                    <Text className="text-[14px] font-bold text-gray-600 m-0">
                      Subject:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-[14px] text-gray-800 m-0">
                      {subject}
                    </Text>
                  </Column>
                </Row>

                <Row>
                  <Column className="w-[120px]">
                    <Text className="text-[14px] font-bold text-gray-600 m-0">
                      Message:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-[14px] text-gray-800 m-0">
                      {message}
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Text className="text-[14px] text-gray-700">
                Please respond to this inquiry as soon as possible.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="mt-[32px] text-center">
              <Text className="text-[14px] text-gray-500 m-0">
                © {new Date().getFullYear()} BuzzTrip. All rights reserved.
              </Text>
              {/* <Text className="text-[14px] text-gray-500 m-0">
                123 Mapping Street, Brisbane, Australia
              </Text>
              <Text className="text-[12px] text-gray-400 mt-[8px] m-0">
                <a href="https://buzztrip.co/unsubscribe" className="text-gray-400">Unsubscribe</a>
              </Text> */}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ContactUsEmail.PreviewProps = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  subject: "Question about BuzzTrip",
  message:
    "I would like to know more about your custom mapping application. Can you provide more details?",
};

export default ContactUsEmail;
