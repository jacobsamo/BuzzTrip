import { defineTable } from "convex/server";
import { v } from "convex/values";

export const authSchema = {
  user: defineTable({
    name: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
    twoFactorEnabled: v.optional(v.boolean()),
    role: v.optional(v.string()),
    banned: v.optional(v.boolean()),
    banReason: v.optional(v.string()),
    banExpires: v.optional(v.string()),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    username: v.optional(v.string()),
    bio: v.optional(v.string()),
  }).index("by_email", ["email"]),
  session: defineTable({
    expiresAt: v.string(),
    token: v.string(),
    updatedAt: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    userId: v.id("user"),
    impersonatedBy: v.optional(v.string()),
  })
    .index("byToken", ["token"])
    .index("byUserId", ["userId"]),
  account: defineTable({
    accountId: v.string(),
    providerId: v.string(),
    userId: v.id("user"),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    idToken: v.optional(v.string()),
    accessTokenExpiresAt: v.optional(v.string()),
    refreshTokenExpiresAt: v.optional(v.string()),
    scope: v.optional(v.string()),
    password: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  }).index("byUserId", ["userId"]),
  verification: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.string(),
    updatedAt: v.optional(v.string()),
  }).index("byIdentifier", ["identifier"]),
  passkey: defineTable({
    name: v.optional(v.string()),
    publicKey: v.string(),
    userId: v.id("user"),
    credentialID: v.string(),
    counter: v.number(),
    deviceType: v.string(),
    backedUp: v.number(),
    transports: v.optional(v.string()),
  }).index("byUserId", ["userId"]),
  twoFactor: defineTable({
    secret: v.string(),
    backupCodes: v.string(),
    userId: v.id("user"),
  })
    .index("byUserId", ["userId"])
    .index("bySecret", ["secret"]),
  jwks: defineTable({
    publicKey: v.string(),
    privateKey: v.string(),
  }),
};
