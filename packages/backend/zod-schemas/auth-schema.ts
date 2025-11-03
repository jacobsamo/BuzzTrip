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
  emailConfirmedAt: z.string().optional(),
  questionnaireCompletedAt: z.string().optional(),
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

// Consolidated Beta Users schema - handles entire beta signup flow
export const betaUsersSchema = z.object({
  ...defaultFields,
  // Identity
  email: z.string(),
  firstName: z.string(),
  lastName: z.string().optional(),

  // Token & Flow
  token: z.string(),
  expiresAt: z.number(),

  // Status Tracking
  emailConfirmed: z.boolean(),
  emailConfirmedAt: z.number().optional(),
  questionnaireCompleted: z.boolean(),
  questionnaireCompletedAt: z.number().optional(),

  // User Preferences
  whatsappOptIn: z.boolean(),

  // Questionnaire Responses (stored directly)
  questionnaireResponses: z.record(z.string(), z.any()).optional(),

  // Link to actual user account (optional - set when user creates account)
  userId: zid("users").optional(),

  // Timestamps
  createdAt: z.number(),
  updatedAt: z.number(),
});
