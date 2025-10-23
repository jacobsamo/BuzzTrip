import { v } from "convex/values";
import { z } from "zod";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { zodMutation } from "./helpers";

/**
 * Submit beta signup form
 * Handles three scenarios:
 * 1. New user (no account) -> create beta_signup, send join email
 * 2. Existing user (has account) -> upgrade to beta, send welcome email
 * 3. Existing beta user -> update responses only
 */
export const submitBetaSignup = zodMutation({
  args: {
    email: z.string().email(),
    responses: z.record(z.string(), z.string()),
  },
  returns: z.object({
    success: z.boolean(),
    message: z.string(),
    scenario: z.enum(["new_signup", "existing_user_upgraded", "already_beta"]),
  }),
  handler: async (ctx, { email, responses }): Promise<{
    success: boolean;
    message: string;
    scenario: "new_signup" | "existing_user_upgraded" | "already_beta";
  }> => {
    const now = new Date().toISOString();

    // 1. Check if user account exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    // 2. Check if beta signup exists
    const existingBetaSignup = await ctx.db
      .query("beta_signups")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    // SCENARIO B & C: User has an account
    if (existingUser) {
      // SCENARIO C: Already a beta user - just update responses
      if (existingUser.isBetaUser) {
        if (existingBetaSignup) {
          await ctx.db.patch(existingBetaSignup._id, { responses });
        }
        return {
          success: true,
          message: "You're already a beta member! Updated your responses.",
          scenario: "already_beta",
        };
      }

      // SCENARIO B: Existing user, upgrade to beta
      let betaSignupId = existingBetaSignup?._id;

      // Create or update beta signup record
      if (!existingBetaSignup) {
        betaSignupId = await ctx.db.insert("beta_signups", {
          email,
          responses,
          isCompleted: true,
          userId: existingUser._id,
          submittedAt: now,
          completedAt: now,
        });
      } else {
        await ctx.db.patch(existingBetaSignup._id, {
          responses,
          isCompleted: true,
          userId: existingUser._id,
          completedAt: now,
        });
      }

      // Update user record
      await ctx.db.patch(existingUser._id, {
        isBetaUser: true,
        betaSignupId,
        betaJoinedAt: now,
      });

      // Send welcome email immediately (NOT join email)
      await ctx.runMutation(internal.emails.sendBetaWelcomeEmail, {
        firstName: existingUser.first_name,
        email: existingUser.email,
        whatsappLink: "https://links.buzztrip.co/whatsapp",
      });

      // Update Clerk metadata
      await ctx.scheduler.runAfter(0, internal.clerk.updateUserMetadata, {
        clerkUserId: existingUser.clerkUserId,
        metadata: { isBetaUser: true, betaJoinedAt: now },
      });

      return {
        success: true,
        message:
          "You've been upgraded to beta! Check your email for the WhatsApp link.",
        scenario: "existing_user_upgraded",
      };
    }

    // SCENARIO A: New signup (no account yet)
    if (existingBetaSignup) {
      // Update existing beta signup
      await ctx.db.patch(existingBetaSignup._id, {
        responses,
        submittedAt: now,
      });
    } else {
      // Create new beta signup
      await ctx.db.insert("beta_signups", {
        email,
        responses,
        isCompleted: false,
        submittedAt: now,
      });
    }

    // Send beta-join email immediately
    await ctx.runMutation(internal.emails.sendBetaJoinEmail, {
      email,
    });

    return {
      success: true,
      message:
        "Check your email! We've sent you a link to complete your signup.",
      scenario: "new_signup",
    };
  },
});

/**
 * Get beta signup by email
 * Used internally by createUser to link records
 */
export const getBetaSignupByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("beta_signups")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});
