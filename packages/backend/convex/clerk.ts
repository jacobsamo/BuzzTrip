import { createClerkClient } from "@clerk/backend";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";

/**
 * Get Clerk client with secret key from environment
 */
function getClerkClient() {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY is not set");
  }
  return createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
}

/**
 * Update Clerk user's public metadata
 * Used to sync beta status to Clerk for JWT tokens
 */
export const updateUserMetadata = internalAction({
  args: {
    clerkUserId: v.string(),
    metadata: v.any(),
  },
  handler: async (ctx, { clerkUserId, metadata }) => {
    try {
      const clerk = getClerkClient();
      await clerk.users.updateUser(clerkUserId, {
        publicMetadata: metadata,
      });
      console.log("✅ Updated Clerk metadata for user:", clerkUserId);
    } catch (error) {
      console.error("❌ Failed to update Clerk metadata:", error);
      throw error;
    }
  },
});
