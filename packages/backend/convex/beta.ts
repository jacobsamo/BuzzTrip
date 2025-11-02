import { v } from "convex/values";
import { z } from "zod";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { internalQuery, mutation, query } from "./_generated/server";
import { authedMutation, authedQuery, zodMutation } from "./helpers";
import { getCurrentUser, mustGetCurrentUser } from "./users";

// Quick signup schema
const betaQuickSignupSchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.string().email(),
  whatsappOptIn: z.boolean(),
});

// Full questionnaire schema
const betaQuestionnaireResponseSchema = z.object({
  // Discovery
  howDidYouHear: z.string(),
  currentMappingTool: z.string().optional(),

  // Use Cases
  primaryUseCase: z.string(),
  useCaseDetails: z.string().optional(),

  // Frequency & Scale
  mapsPerMonth: z.string().optional(),
  collaboratorsCount: z.string().optional(),

  // Features
  expectedFeatures: z.array(z.string()),
  mostImportantFeature: z.string().optional(),

  // Pricing
  willingToPay: z.string(),
  pricingModel: z.string().optional(),

  // Participation
  willingToProvideHelpFeedback: z.boolean(),
  participationLevel: z.string().optional(),

  // Open-ended
  painPoints: z.string().optional(),
  dealbreakers: z.string().optional(),
  additionalComments: z.string().optional(),
});

/**
 * Quick beta signup - Step 1
 * Creates beta user record and sends email with questionnaire link
 */
export const quickBetaSignup = zodMutation({
  args: betaQuickSignupSchema,
  returns: z.object({
    success: z.boolean(),
    message: z.string(),
    requiresSignup: z.boolean(),
  }),
  handler: async (ctx, args) => {
    const { firstName, lastName, email, whatsappOptIn } = args;

    // Check if user is already authenticated
    const currentUser = await getCurrentUser(ctx);

    if (currentUser) {
      // Existing user - immediately upgrade to beta
      await ctx.db.patch(currentUser._id, {
        isBetaUser: true,
        betaSignupDate: new Date().toISOString(),
        whatsappOptIn: whatsappOptIn,
        updatedAt: new Date().toISOString(),
      });

      // Generate questionnaire token
      const token = crypto.randomUUID();
      await ctx.db.insert("beta_questionnaire_tokens", {
        userId: currentUser._id,
        token,
        email: currentUser.email,
        used: false,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      // Send beta welcome email with questionnaire link
      await ctx.scheduler.runAfter(
        0,
        internal.emails_beta.sendBetaWelcomeEmail,
        {
          firstName: currentUser.first_name ?? firstName,
          email: currentUser.email,
          whatsappOptIn,
          questionnaireToken: token,
        }
      );

      return {
        success: true,
        message: "Welcome to the beta! Check your email for next steps.",
        requiresSignup: false,
      };
    } else {
      // New user - they need to sign up first
      // Store their beta interest with a token
      const token = crypto.randomUUID();
      await ctx.db.insert("beta_pending_signups", {
        firstName,
        lastName: lastName ?? undefined,
        email,
        whatsappOptIn,
        token,
        createdAt: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return {
        success: true,
        message: "Please create an account to join the beta program.",
        requiresSignup: true,
      };
    }
  },
});

/**
 * Complete pending beta signup after user creates account
 * Called from user creation webhook
 */
export const completePendingBetaSignup = mutation({
  args: { email: v.string(), userId: v.id("users") },
  handler: async (ctx, { email, userId }) => {
    // Find pending beta signup
    const pending = await ctx.db
      .query("beta_pending_signups")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!pending || pending.expiresAt < Date.now()) {
      return { found: false };
    }

    // Upgrade user to beta
    await ctx.db.patch(userId, {
      isBetaUser: true,
      betaSignupDate: new Date().toISOString(),
      whatsappOptIn: pending.whatsappOptIn,
      updatedAt: new Date().toISOString(),
    });

    // Generate questionnaire token
    const token = crypto.randomUUID();
    await ctx.db.insert("beta_questionnaire_tokens", {
      userId,
      token,
      email,
      used: false,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    // Send beta welcome email
    await ctx.scheduler.runAfter(0, internal.emails_beta.sendBetaWelcomeEmail, {
      firstName: pending.firstName,
      email,
      whatsappOptIn: pending.whatsappOptIn,
      questionnaireToken: token,
    });

    // Clean up pending signup
    await ctx.db.delete(pending._id);

    return { found: true, token };
  },
});

/**
 * Verify questionnaire token
 */
export const verifyQuestionnaireToken = query({
  args: { token: v.string() },
  returns: v.union(
    v.object({
      valid: v.literal(false),
      reason: v.string(),
    }),
    v.object({
      valid: v.literal(true),
      userId: v.id("users"),
      email: v.string(),
      userName: v.optional(v.string()),
    })
  ),
  handler: async (ctx, { token }) => {
    const tokenDoc = await ctx.db
      .query("beta_questionnaire_tokens")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!tokenDoc) {
      return { valid: false, reason: "Token not found" };
    }

    if (tokenDoc.used) {
      return { valid: false, reason: "Token already used" };
    }

    if (tokenDoc.expiresAt < Date.now()) {
      return { valid: false, reason: "Token expired" };
    }

    const user = await ctx.db.get(tokenDoc.userId);
    if (!user) {
      return { valid: false, reason: "User not found" };
    }

    return {
      valid: true,
      userId: tokenDoc.userId,
      email: tokenDoc.email,
      userName: user.first_name ?? user.name,
    };
  },
});

/**
 * Submit questionnaire responses - Step 2
 */
export const submitQuestionnaire = zodMutation({
  args: {
    token: z.string(),
    responses: betaQuestionnaireResponseSchema,
  },
  returns: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  handler: async (ctx, { token, responses }) => {
    // Verify token
    const tokenDoc = await ctx.db
      .query("beta_questionnaire_tokens")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!tokenDoc) {
      throw new Error("Invalid token");
    }

    if (tokenDoc.used) {
      throw new Error("Token already used");
    }

    if (tokenDoc.expiresAt < Date.now()) {
      throw new Error("Token expired");
    }

    // Update user with questionnaire responses
    await ctx.db.patch(tokenDoc.userId, {
      betaQuestionnaireResponses: responses,
      updatedAt: new Date().toISOString(),
    });

    // Mark token as used
    await ctx.db.patch(tokenDoc._id, {
      used: true,
    });

    return {
      success: true,
      message: "Thank you for completing the questionnaire!",
    };
  },
});

/**
 * Check if current user is beta member
 */
export const checkBetaStatus = authedQuery({
  args: {},
  returns: v.object({
    isBetaUser: v.boolean(),
    betaSignupDate: v.optional(v.string()),
    hasCompletedQuestionnaire: v.boolean(),
  }),
  handler: async (ctx) => {
    const user = await mustGetCurrentUser(ctx);

    return {
      isBetaUser: user.isBetaUser ?? false,
      betaSignupDate: user.betaSignupDate,
      hasCompletedQuestionnaire: !!user.betaQuestionnaireResponses,
    };
  },
});

/**
 * Admin: Get all beta users
 * Internal query - should be called from admin dashboard with proper auth checks
 */
export const getBetaUsers = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("users"),
      name: v.string(),
      email: v.string(),
      betaSignupDate: v.optional(v.string()),
      hasCompletedQuestionnaire: v.boolean(),
      whatsappOptIn: v.optional(v.boolean()),
    })
  ),
  handler: async (ctx) => {
    const betaUsers = await ctx.db
      .query("users")
      .withIndex("by_isBetaUser", (q) => q.eq("isBetaUser", true))
      .collect();

    return betaUsers.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      betaSignupDate: user.betaSignupDate,
      hasCompletedQuestionnaire: !!user.betaQuestionnaireResponses,
      whatsappOptIn: user.whatsappOptIn,
    }));
  },
});

/**
 * Admin: Get questionnaire responses for analysis
 * Internal query - should be called from admin dashboard with proper auth checks
 */
export const getBetaQuestionnaireResponses = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      userId: v.id("users"),
      email: v.string(),
      name: v.string(),
      signupDate: v.optional(v.string()),
      responses: v.any(), // Using v.any() since the questionnaire responses are dynamic
    })
  ),
  handler: async (ctx) => {
    const betaUsers = await ctx.db
      .query("users")
      .withIndex("by_isBetaUser", (q) => q.eq("isBetaUser", true))
      .collect();

    return betaUsers
      .filter((user) => user.betaQuestionnaireResponses)
      .map((user) => ({
        userId: user._id,
        email: user.email,
        name: user.name,
        signupDate: user.betaSignupDate,
        responses: user.betaQuestionnaireResponses,
      }));
  },
});
