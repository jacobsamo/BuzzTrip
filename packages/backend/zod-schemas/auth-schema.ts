import { zid } from "convex-helpers/server/zod";
import * as z from "zod";
import { defaultFields, insertSchema } from "./shared-schemas";

export const userSchema = z.object({
  ...defaultFields,
  clerkUserId: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string(),
  updatedAt: z.string(),
  createdAt: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  bio: z.string().optional(),
  // Beta/VIP fields
  isBetaUser: z.boolean().optional(),
  betaSignupDate: z.string().optional(),
  betaQuestionnaireResponses: z.record(z.string(), z.any()).optional(),
  whatsappOptIn: z.boolean().optional(),
});

export const usersEditSchema = insertSchema(userSchema);

export const refinedUserSchema = userSchema.pick({
  _id: true,
  email: true,
  username: true,
  first_name: true,
  last_name: true,
  name: true,
  image: true,
});

// Beta program schemas
export const betaQuestionnaireTokenSchema = z.object({
  ...defaultFields,
  userId: zid("users"),
  token: z.string(),
  email: z.string(),
  used: z.boolean(),
  expiresAt: z.number(),
});

export const betaPendingSignupSchema = z.object({
  ...defaultFields,
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.string(),
  whatsappOptIn: z.boolean(),
  token: z.string(),
  createdAt: z.number(),
  expiresAt: z.number(),
});
