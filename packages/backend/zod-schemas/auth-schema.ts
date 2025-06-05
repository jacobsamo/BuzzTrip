import { zid } from "convex-helpers/server/zod";
import * as z from "zod";
import { defaultFields, insertSchema } from "./shared-schemas";

export const userSchema = z.object({
  ...defaultFields,
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  updatedAt: z.string().optional(),
  twoFactorEnabled: z.boolean().optional(),
  role: z.string().optional(),
  banned: z.boolean().optional(),
  banReason: z.string().optional(),
  banExpires: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  bio: z.string().optional(),
});

export const usersEditSchema = insertSchema(userSchema)

export const refinedUserSchema = userSchema.pick({
  _id: true,
  email: true,
  username: true,
  first_name: true,
  last_name: true,
  name: true,
  image: true,
});


export const sessionSchema = z.object({
  ...defaultFields,
  expiresAt: z.string(),
  token: z.string(),
  updatedAt: z.string(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  userId: zid("user"),
  impersonatedBy: z.string().optional(),
});

export const accountSchema = z.object({
  ...defaultFields,
  accountId: z.string(),
  providerId: z.string(),
  userId: zid("user"),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  idToken: z.string().optional(),
  accessTokenExpiresAt: z.string().optional(),
  refreshTokenExpiresAt: z.string().optional(),
  scope: z.string().optional(),
  password: z.string().optional(),
  updatedAt: z.string().optional(),
});
export const verificationSchema = z.object({
  ...defaultFields,
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.string(),
  updatedAt: z.string().optional(),
});
export const passkeySchema = z.object({
  ...defaultFields,
  name: z.string().optional(),
  publicKey: z.string(),
  userId: zid("user"),
  credentialID: z.string(),
  counter: z.number(),
  deviceType: z.string(),
  backedUp: z.number(),
  transports: z.string().optional(),
});
export const twoFactorSchema = z.object({
  ...defaultFields,
  secret: z.string(),
  backupCodes: z.string(),
  userId: zid("user"),
});

export const jwksSchema = z.object({
  ...defaultFields,
  publicKey: z.string(),
  privateKey: z.string(),
});
