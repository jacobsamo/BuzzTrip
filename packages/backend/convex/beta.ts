import { zid } from "convex-helpers/server/zod4";
import { z } from "zod";
import { betaUsersEditSchema } from "../zod-schemas";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { authedQuery, zodMutation, zodQuery } from "./helpers";
import { getCurrentUser, mustGetCurrentUser } from "./users";
import { BETA_TOKEN_EXPIRY_MS } from "./utils/constants";
import { generateSecureToken, isValidTokenFormat } from "./utils/crypto";

// Import schemas from shared location
// Quick signup schema (without validation messages for backend)
const betaQuickSignupSchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.string().email(),
  whatsappOptIn: z.boolean(),
});

// Questionnaire response schema (without validation messages for backend)
const betaQuestionnaireResponseSchema = z.object({
  // Discovery & Background
  howDidYouHear: z.enum([
    "google",
    "friend",
    "social-media",
    "blog-article",
    "youtube",
    "reddit",
    "other",
  ]),
  howDidYouHearOther: z.string().optional(),
  currentMappingTools: z.array(z.string()).optional(),
  currentMappingToolsOther: z.string().optional(),

  // Use Cases
  primaryUseCase: z.enum([
    "personal",
    "business",
    "education",
    "research",
    "events",
    "content-creation",
    "other",
  ]),
  useCaseDetails: z.string().optional(),

  // Frequency & Scale
  mapsPerMonth: z.enum(["1-5", "6-10", "11-25", "26-50", "50+"]),
  collaboratorsCount: z.enum(["just-me", "2-5", "6-10", "11-25", "25+"]),

  // Features
  expectedFeatures: z.array(z.string()).min(1),
  mostImportantFeature: z.string().min(2),

  // Pricing
  willingToPay: z.enum(["free-only", "0-5", "5-10", "10-20", "20-50", "50+"]),
  pricingModel: z.enum(["monthly", "yearly", "one-time", "usage-based"]),

  // Participation
  willingToProvideHelpFeedback: z.boolean(),
  participationLevel: z.enum(["passive", "occasional", "active", "super-user"]),

  // Open-ended
  painPoints: z.string().optional(),
  dealbreakers: z.string().optional(),
  additionalComments: z.string().optional(),
});

// Reusable return type schemas - based on betaUsersSchema
const betaUserReturnSchema = betaUsersEditSchema
  .pick({
    _id: true,
    userId: true,
    firstName: true,
    lastName: true,
    email: true,
    createdAt: true,
    emailConfirmed: true,
    questionnaireCompleted: true,
    whatsappOptIn: true,
  })
  .extend({
    betaSignupDate: z.string(), // ISO string representation of createdAt
  });

/**
 * Quick beta signup - Step 1
 * Creates waitlist entry and sends confirmation email
 */
export const quickBetaSignup = zodMutation({
  args: betaQuickSignupSchema,
  returns: z.object({
    success: z.boolean(),
    message: z.string(),
    requiresConfirmation: z.boolean().optional(),
    alreadyConfirmed: z.boolean().optional(),
    resentConfirmation: z.boolean().optional(),
  }),
  handler: async (ctx, args) => {
    const { firstName, lastName, email, whatsappOptIn } = args;

    // Check if user is already authenticated
    const currentUser = await getCurrentUser(ctx);

    // Check for existing beta_users entry for this email
    const existingBetaUser = await ctx.db
      .query("beta_users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingBetaUser) {
      // Check if already confirmed and completed
      if (
        existingBetaUser.emailConfirmed &&
        existingBetaUser.questionnaireCompleted
      ) {
        return {
          success: true,
          message: "You've already completed the beta signup. Please sign in.",
          alreadyConfirmed: true,
        };
      }

      // If not confirmed, resend confirmation email with same token
      if (!existingBetaUser.emailConfirmed) {
        await ctx.scheduler.runAfter(
          0,
          internal.emails_beta.sendBetaConfirmationEmail,
          {
            firstName,
            email,
            token: existingBetaUser.token,
          }
        );

        return {
          success: true,
          message: "Confirmation email resent. Please check your inbox.",
          resentConfirmation: true,
        };
      }

      // If confirmed but not completed questionnaire, resend link
      if (
        existingBetaUser.emailConfirmed &&
        !existingBetaUser.questionnaireCompleted
      ) {
        await ctx.scheduler.runAfter(
          0,
          internal.emails_beta.sendBetaConfirmationEmail,
          {
            firstName,
            email,
            token: existingBetaUser.token,
          }
        );

        return {
          success: true,
          message: "Confirmation email resent. Please check your inbox.",
          resentConfirmation: true,
        };
      }
    }

    // Create or get user ID
    let userId: Id<"users"> | undefined = currentUser?._id;

    // If no user exists, check if they have an account by email
    if (!userId) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();
      userId = existingUser?._id;
    }

    // Generate cryptographically secure token and create beta_users entry
    const token = generateSecureToken();
    const now = Date.now();

    try {
      await ctx.db.insert("beta_users", {
        firstName,
        lastName: lastName ?? undefined,
        email,
        whatsappOptIn,
        token,
        emailConfirmed: false,
        questionnaireCompleted: false,
        userId: userId ?? undefined,
        createdAt: now,
        updatedAt: now,
        expiresAt: now + BETA_TOKEN_EXPIRY_MS,
      });
    } catch (error) {
      // Handle race condition - another request may have created entry
      const existingEntry = await ctx.db
        .query("beta_users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      if (existingEntry && !existingEntry.emailConfirmed) {
        // Resend confirmation with existing token
        await ctx.scheduler.runAfter(
          0,
          internal.emails_beta.sendBetaConfirmationEmail,
          {
            firstName,
            email,
            token: existingEntry.token,
          }
        );

        return {
          success: true,
          message: "Confirmation email resent. Please check your inbox.",
          resentConfirmation: true,
        };
      }

      // Re-throw if it's a different error
      throw error;
    }

    // Send confirmation email
    await ctx.scheduler.runAfter(
      0,
      internal.emails_beta.sendBetaConfirmationEmail,
      {
        firstName,
        email,
        token,
      }
    );

    return {
      success: true,
      message: "Please check your email to confirm your beta signup.",
      requiresConfirmation: true,
    };
  },
});

/**
 * Complete pending beta signup after user creates account
 * Called from user creation webhook
 */
export const completePendingBetaSignup = zodMutation({
  args: {
    email: z.string().email(),
    userId: zid("users"),
  },
  returns: z.object({
    found: z.boolean(),
    token: z.string().optional(),
  }),
  handler: async (ctx, { email, userId }) => {
    // Find beta_users entry for this email
    const betaUser = await ctx.db
      .query("beta_users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!betaUser || betaUser.expiresAt < Date.now()) {
      return { found: false };
    }

    // Link the beta_users entry to the new user account
    const now = Date.now();
    await ctx.db.patch(betaUser._id, {
      userId,
      updatedAt: now,
    });

    // If questionnaire already completed, grant beta access
    if (betaUser.questionnaireCompleted) {
      const nowISO = new Date(now).toISOString();
      await ctx.db.patch(userId, {
        isBetaUser: true,
        updatedAt: nowISO,
      });
    }

    return { found: true, token: betaUser.token };
  },
});

/**
 * Confirm email from confirmation link
 * Marks email as confirmed and allows questionnaire access
 */
export const confirmEmail = zodMutation({
  args: z.object({
    token: z.string(),
  }),
  returns: z.object({
    success: z.boolean(),
    message: z.string(),
    error: z.string().optional(),
  }),
  handler: async (ctx, { token }) => {
    // Validate token format
    if (!token || !isValidTokenFormat(token)) {
      return {
        success: false,
        message: "Invalid token format.",
        error: "invalid_format",
      };
    }

    // Query beta_users table
    const betaUser = await ctx.db
      .query("beta_users")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!betaUser) {
      return {
        success: false,
        message: "Invalid or expired token.",
        error: "not_found",
      };
    }

    // Check if questionnaire already completed
    if (betaUser.questionnaireCompleted) {
      return {
        success: false,
        message:
          "You've already completed the questionnaire and have beta access!",
        error: "already_completed",
      };
    }

    // Check if already confirmed
    if (betaUser.emailConfirmed) {
      return {
        success: true,
        message:
          "Email already confirmed. You can now complete the questionnaire.",
      };
    }

    // Check if expired
    if (betaUser.expiresAt < Date.now()) {
      return {
        success: false,
        message: "Token has expired.",
        error: "expired",
      };
    }

    // Mark as email confirmed
    const now = Date.now();
    await ctx.db.patch(betaUser._id, {
      emailConfirmed: true,
      emailConfirmedAt: now,
      updatedAt: now,
    });

    return {
      success: true,
      message: "Email confirmed! Please complete the questionnaire.",
    };
  },
});

/**
 * Submit questionnaire responses - Step 2
 * Grants beta access after questionnaire completion
 */
export const submitQuestionnaire = zodMutation({
  args: {
    token: z.string(),
    responses: betaQuestionnaireResponseSchema,
  },
  returns: z.object({
    success: z.boolean(),
    message: z.string(),
    error: z.string().optional(),
  }),
  handler: async (ctx, { token, responses }) => {
    // Validate token format
    if (!token || !isValidTokenFormat(token)) {
      return {
        success: false,
        message: "Invalid token format.",
        error: "invalid_format",
      };
    }

    // Verify token
    const betaUser = await ctx.db
      .query("beta_users")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!betaUser) {
      return {
        success: false,
        message: "Invalid token.",
        error: "not_found",
      };
    }

    if (!betaUser.emailConfirmed) {
      return {
        success: false,
        message: "Email not confirmed. Please confirm your email first.",
        error: "email_not_confirmed",
      };
    }

    if (betaUser.questionnaireCompleted) {
      return {
        success: false,
        message: "Questionnaire already completed.",
        error: "already_completed",
      };
    }

    if (betaUser.expiresAt < Date.now()) {
      return {
        success: false,
        message: "Token expired.",
        error: "expired",
      };
    }

    // Store questionnaire responses in beta_users table
    const now = Date.now();
    await ctx.db.patch(betaUser._id, {
      questionnaireResponses: responses,
      questionnaireCompleted: true,
      questionnaireCompletedAt: now,
      updatedAt: now,
    });

    // If user has an account, grant them beta access
    if (betaUser.userId) {
      const user = await ctx.db.get(betaUser.userId);
      if (user) {
        const nowISO = new Date(now).toISOString();
        await ctx.db.patch(betaUser.userId, {
          isBetaUser: true,
          updatedAt: nowISO,
        });

        // Send beta welcome email
        await ctx.scheduler.runAfter(
          0,
          internal.emails_beta.sendBetaWelcomeEmail,
          {
            firstName: user.first_name ?? user.name,
            email: betaUser.email,
            whatsappOptIn: betaUser.whatsappOptIn,
            questionnaireToken: token,
          }
        );
      }
    } else {
      // User doesn't have an account yet - just send welcome email
      await ctx.scheduler.runAfter(
        0,
        internal.emails_beta.sendBetaWelcomeEmail,
        {
          firstName: betaUser.firstName,
          email: betaUser.email,
          whatsappOptIn: betaUser.whatsappOptIn,
          questionnaireToken: token,
        }
      );
    }

    return {
      success: true,
      message:
        "Thank you for completing the questionnaire! You now have beta access.",
    };
  },
});

/**
 * Check waitlist status by email
 */
export const checkWaitlistStatus = zodQuery({
  args: {
    email: z.string().email(),
  },
  returns: z.object({
    status: z.enum([
      "not_signed_up",
      "pending_confirmation",
      "confirmed",
      "completed",
    ]),
    emailConfirmed: z.boolean().optional(),
    questionnaireCompleted: z.boolean().optional(),
  }),
  handler: async (ctx, { email }) => {
    // Check for existing beta_users entry
    const betaUser = await ctx.db
      .query("beta_users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!betaUser) {
      return {
        status: "not_signed_up" as const,
      };
    }

    // Check status based on beta_users fields
    if (betaUser.emailConfirmed && betaUser.questionnaireCompleted) {
      return {
        status: "completed" as const,
        emailConfirmed: true,
        questionnaireCompleted: true,
      };
    }

    if (betaUser.emailConfirmed && !betaUser.questionnaireCompleted) {
      return {
        status: "confirmed" as const,
        emailConfirmed: true,
        questionnaireCompleted: false,
      };
    }

    if (!betaUser.emailConfirmed) {
      return {
        status: "pending_confirmation" as const,
        emailConfirmed: false,
        questionnaireCompleted: false,
      };
    }

    return {
      status: "not_signed_up" as const,
    };
  },
});

/**
 * Check if current user is beta member
 */
export const checkBetaStatus = authedQuery({
  args: {},
  returns: z.object({
    isBetaUser: z.boolean(),
    betaSignupDate: z.string().optional(),
    hasCompletedQuestionnaire: z.boolean(),
    whatsappOptIn: z.boolean().optional(),
  }),
  handler: async (ctx) => {
    const user = await mustGetCurrentUser(ctx);

    // Get beta info from beta_users table
    const betaUser = await ctx.db
      .query("beta_users")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .first();

    if (!betaUser) {
      return {
        isBetaUser: false,
        hasCompletedQuestionnaire: false,
      };
    }

    return {
      isBetaUser: user.isBetaUser ?? false,
      betaSignupDate: new Date(betaUser.createdAt).toISOString(),
      hasCompletedQuestionnaire: betaUser.questionnaireCompleted,
      whatsappOptIn: betaUser.whatsappOptIn,
    };
  },
});

/**
 * Admin: Get all beta users
 * TODO: Add proper role-based authorization when admin roles are implemented
 * For now, requires authentication - should only be exposed to admin users
 */
export const getBetaUsers = zodQuery({
  args: {},
  returns: z.array(betaUserReturnSchema),
  handler: async (ctx) => {
    // Ensure user is authenticated
    const currentUser = await mustGetCurrentUser(ctx);

    // TODO: Add admin check when role system is implemented
    // Example: if (!currentUser.isAdmin) throw new Error("Forbidden: Admin access required");

    const betaUsers = await ctx.db.query("beta_users").collect();

    return betaUsers.map((betaUser) => ({
      _id: betaUser._id,
      userId: betaUser.userId ?? undefined,
      firstName: betaUser.firstName,
      lastName: betaUser.lastName ?? undefined,
      email: betaUser.email,
      createdAt: betaUser.createdAt,
      betaSignupDate: new Date(betaUser.createdAt).toISOString(),
      emailConfirmed: betaUser.emailConfirmed,
      questionnaireCompleted: betaUser.questionnaireCompleted,
      whatsappOptIn: betaUser.whatsappOptIn,
    }));
  },
});

/**
 * Admin: Get questionnaire responses for analysis
 * TODO: Add proper role-based authorization when admin roles are implemented
 * For now, requires authentication - should only be exposed to admin users
 */
export const getBetaQuestionnaireResponses = zodQuery({
  args: {},
  returns: z.array(
    z.object({
      betaUserId: zid("beta_users"),
      userId: zid("users").nullish(),
      email: z.string(),
      firstName: z.string(),
      lastName: z.string().nullish(),
      signupDate: z.string(),
      responses: z.record(z.string(), z.any()),
    })
  ),
  handler: async (ctx) => {
    // Ensure user is authenticated
    const currentUser = await mustGetCurrentUser(ctx);

    // TODO: Add admin check when role system is implemented
    // Example: if (!currentUser.isAdmin) throw new Error("Forbidden: Admin access required");

    const betaUsers = await ctx.db.query("beta_users").collect();

    return betaUsers
      .filter(
        (betaUser) =>
          betaUser.questionnaireCompleted && betaUser.questionnaireResponses
      )
      .map((betaUser) => ({
        betaUserId: betaUser._id,
        userId: betaUser.userId ?? undefined,
        email: betaUser.email,
        firstName: betaUser.firstName,
        lastName: betaUser.lastName ?? undefined,
        signupDate: new Date(betaUser.createdAt).toISOString(),
        responses: betaUser.questionnaireResponses!,
      }));
  },
});
