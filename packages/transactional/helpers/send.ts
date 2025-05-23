import { ReactNode } from "react";
import { Resend } from "resend";

export const createResend = (resendApiKey: string) => {
  return new Resend(resendApiKey);
};

/**
 * credit to dub.co for their setup of resend
 * https://github.com/steven-tey/dub/blob/main/apps/web/emails/index.ts
 */
export const sendEmail = async ({
  resend,
  email,
  subject,
  react,
  test,
}: {
  resend: Resend | null;
  email: string;
  subject: string;
  react: ReactNode;
  test?: boolean;
}) => {
  try {
    if (!resend) {
      throw Error(
        "Resend is not configured. You need to add a RESEND_API_KEY in your .env file for emails to work."
      );
    }

    const { data, error } = await resend.emails.send({
      from: "support@buzztrip.co",
      to: test ? "delivered@resend.dev" : [email],
      subject,
      react,
    });
    if (error) throw error;
  } catch (error) {
    throw Error(error as any);
  }
};
