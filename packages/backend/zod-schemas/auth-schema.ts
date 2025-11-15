import { zid } from "convex-helpers/server/zod4";
import * as z from "zod";
import { zodTable } from "./helpers";

// Define users table
export const usersTable = zodTable("users", {
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
  // Beta flag - used for quick auth checks without joining tables
  isBetaUser: z.boolean().optional(),
});

// Export schema
export const userSchema = usersTable.schema;
export const usersEditSchema = usersTable.insertSchema;

export const refinedUserSchema = userSchema.pick({
  _id: true,
  email: true,
  username: true,
  first_name: true,
  last_name: true,
  name: true,
  image: true,
});

// Define beta_users table
export const betaUsersTable = zodTable("beta_users", {
  // Identity
  email: z.string(),
  firstName: z.string(),
  lastName: z.string().nullish(),

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
  userId: zid("users").nullish(),

  // Timestamps
  createdAt: z.number(),
  updatedAt: z.number(),
});

// Export schema
export const betaUsersSchema = betaUsersTable.schema;
export const betaUsersEditSchema = betaUsersTable.insertSchema;