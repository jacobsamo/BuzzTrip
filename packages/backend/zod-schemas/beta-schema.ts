import { z } from "zod";
import { defaultFields } from "./shared-schemas";

export const betaSignupSchema = z.object({
  ...defaultFields,
  email: z.string().email(),
  responses: z.record(z.string(), z.string()),
  isCompleted: z.boolean().default(false),
  userId: z.string().optional(),
  submittedAt: z.string(),
  completedAt: z.string().optional(),
});

export type BetaSignup = z.infer<typeof betaSignupSchema>;
