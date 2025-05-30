"use server";

import { publicAction } from "@/actions/safe-action";
import { contactSchema } from "@/types/scheams";
import ContactUsEmail from "@buzztrip/transactional/emails/contact-us";
import { createResend, sendEmail } from "@buzztrip/transactional/helpers";
import { env } from "env";

export const sendContactEmail = publicAction
  .schema(contactSchema)
  .metadata({ name: "send-contact-us-email" })
  .action(async ({ parsedInput }) => {
    const resend = createResend(env.RESEND_API_KEY);

    // const randomUniquePassword = Math.random().toString(36).slice(-8);

    // const newUsers = authClient.admin.createUser({
    //   email: parsedInput.email,
    //   name: `${parsedInput.firstName} ${parsedInput.lastName}`,
    //   password: randomUniquePassword,
    // });

    return sendEmail({
      resend,
      email: parsedInput.email,
      subject: parsedInput.subject,
      react: ContactUsEmail({
        firstName: parsedInput.firstName,
        lastName: parsedInput.lastName,
        email: parsedInput.email,
        subject: parsedInput.subject,
        message: parsedInput.message,
      }),
    });
  });
