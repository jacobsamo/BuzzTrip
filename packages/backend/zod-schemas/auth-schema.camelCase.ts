/**
 * CAMEL CASE VERSION OF AUTH SCHEMA
 *
 * Replace auth-schema.ts with this file AFTER running the migration.
 * Rename this file to auth-schema.ts after migration is complete.
 */

import { zid } from "convex-helpers/server/zod4";
import * as z from "zod";
import { zodTable } from "./helpers";

// Define users table - CAMEL CASE
export const usersTable = zodTable("users", {
  clerkUserId: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string(),
  createdAt: z.string().optional(),
  firstName: z.string().optional(), // was: first_name
  lastName: z.string().optional(), // was: last_name
  username: z.string().optional(),
  bio: z.string().optional(),
  isBetaUser: z.boolean().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  language: z.string().optional(),
});

export const userSchema = usersTable.schema;
export const usersEditSchema = usersTable.insertSchema;

export const refinedUserSchema = userSchema.pick({
  _id: true,
  email: true,
  username: true,
  firstName: true,
  lastName: true,
  name: true,
  image: true,
});

// Define betaUsers table - CAMEL CASE (table name)
export const betaUsersTable = zodTable("betaUsers", {
  email: z.string(),
  firstName: z.string(),
  lastName: z.string().nullish(),
  token: z.string(),
  expiresAt: z.number(),
  emailConfirmed: z.boolean(),
  emailConfirmedAt: z.number().optional(),
  questionnaireCompleted: z.boolean(),
  questionnaireCompletedAt: z.number().optional(),
  whatsappOptIn: z.boolean(),
  questionnaireResponses: z.record(z.string(), z.any()).optional(),
  userId: zid("users").nullish(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const betaUsersSchema = betaUsersTable.schema;
export const betaUsersEditSchema = betaUsersTable.insertSchema;
