import * as z from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email(),
  subject: z.string().min(5, "Subject line is required"),
  message: z.string().min(10, "Message is required"),
});
