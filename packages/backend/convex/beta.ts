import { v } from "convex/values";
import { z } from "zod";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { authedQuery, zodMutation } from "./helpers";
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
  howDidYouHearOther: z.string().optional(),
  currentMappingTools: z.array(z.string()).optional(),
  currentMappingToolsOther: z.string().optional(),

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
      if (existingBetaUser.emailConfirmed && existingBetaUser.questionnaireCompleted) {
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
      if (existingBetaUser.emailConfirmed && !existingBetaUser.questionnaireCompleted) {
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

    // Generate token and create beta_users entry
    const token = crypto.randomUUID();
    const now = Date.now();
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
      expiresAt: now + 30 * 24 * 60 * 60 * 1000, // 30 days
    });

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
export const completePendingBetaSignup = mutation({
  args: { email: v.string(), userId: v.id("users") },
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

    // Update user with beta info
    const nowISO = new Date(now).toISOString();
    await ctx.db.patch(userId, {
      whatsappOptIn: betaUser.whatsappOptIn,
      updatedAt: nowISO,
    });

    // If questionnaire already completed, grant beta access
    if (betaUser.questionnaireCompleted) {
      await ctx.db.patch(userId, {
        isBetaUser: true,
        betaSignupDate: nowISO,
        betaQuestionnaireResponses: betaUser.questionnaireResponses,
        questionnaireCompletedAt: betaUser.questionnaireCompletedAt
          ? new Date(betaUser.questionnaireCompletedAt).toISOString()
          : nowISO,
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
        message: "You've already completed the questionnaire and have beta access!",
        error: "already_completed",
      };
    }

    // Check if already confirmed
    if (betaUser.emailConfirmed) {
      return {
        success: true,
        message: "Email already confirmed. You can now complete the questionnaire.",
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

    // If user has an account, update the user record too
    if (betaUser.userId) {
      await ctx.db.patch(betaUser.userId, {
        emailConfirmedAt: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString(),
      });
    }

    return {
      success: true,
      message: "Email confirmed! Please complete the questionnaire.",
    };
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
      userId: v.union(v.id("users"), v.null()),
      email: v.string(),
      userName: v.optional(v.string()),
    })
  ),
  handler: async (ctx, { token }) => {
    const betaUser = await ctx.db
      .query("beta_users")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!betaUser) {
      return { valid: false as const, reason: "Token not found" };
    }

    if (!betaUser.emailConfirmed) {
      return { valid: false as const, reason: "Email not confirmed. Please check your inbox for the confirmation email." };
    }

    if (betaUser.questionnaireCompleted) {
      return { valid: false as const, reason: "Questionnaire already completed" };
    }

    if (betaUser.expiresAt < Date.now()) {
      return { valid: false as const, reason: "Token expired" };
    }

    // Get user name if userId is set
    let userName: string | undefined;
    if (betaUser.userId) {
      const user = await ctx.db.get(betaUser.userId);
      userName = user?.first_name ?? user?.name;
    } else {
      // Use first name from beta_users if no account yet
      userName = betaUser.firstName;
    }

    return {
      valid: true as const,
      userId: betaUser.userId ?? null,
      email: betaUser.email,
      userName,
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
  }),
  handler: async (ctx, { token, responses }) => {
    // Verify token
    const betaUser = await ctx.db
      .query("beta_users")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!betaUser) {
      throw new Error("Invalid token");
    }

    if (!betaUser.emailConfirmed) {
      throw new Error("Email not confirmed");
    }

    if (betaUser.questionnaireCompleted) {
      throw new Error("Questionnaire already completed");
    }

    if (betaUser.expiresAt < Date.now()) {
      throw new Error("Token expired");
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
          betaQuestionnaireResponses: responses,
          questionnaireCompletedAt: nowISO,
          isBetaUser: true,
          betaSignupDate: nowISO,
          updatedAt: nowISO,
        });

        // Send beta welcome email
        await ctx.scheduler.runAfter(0, internal.emails_beta.sendBetaWelcomeEmail, {
          firstName: user.first_name ?? user.name,
          email: betaUser.email,
          whatsappOptIn: betaUser.whatsappOptIn,
          questionnaireToken: token,
        });
      }
    } else {
      // User doesn't have an account yet - just send welcome email
      await ctx.scheduler.runAfter(0, internal.emails_beta.sendBetaWelcomeEmail, {
        firstName: betaUser.firstName,
        email: betaUser.email,
        whatsappOptIn: betaUser.whatsappOptIn,
        questionnaireToken: token,
      });
    }

    return {
      success: true,
      message: "Thank you for completing the questionnaire! You now have beta access.",
    };
  },
});

/**
 * Check waitlist status by email
 */
export const checkWaitlistStatus = query({
  args: { email: v.string() },
  returns: v.object({
    status: v.union(
      v.literal("not_signed_up"),
      v.literal("pending_confirmation"),
      v.literal("confirmed"),
      v.literal("completed")
    ),
    emailConfirmed: v.optional(v.boolean()),
    questionnaireCompleted: v.optional(v.boolean()),
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
export const getBetaUsers = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("users"),
      name: v.string(),
      email: v.string(),
      betaSignupDate: v.union(v.string(), v.null()),
      hasCompletedQuestionnaire: v.boolean(),
      whatsappOptIn: v.union(v.boolean(), v.null()),
    })
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const betaUsers = await ctx.db
      .query("users")
      .withIndex("by_isBetaUser", (q) => q.eq("isBetaUser", true))
      .collect();

    return betaUsers.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      betaSignupDate: user.betaSignupDate ?? null,
      hasCompletedQuestionnaire: !!user.betaQuestionnaireResponses,
      whatsappOptIn: user.whatsappOptIn ?? null,
    }));
  },
});

/**
 * Admin: Get questionnaire responses for analysis
 * Internal query - should be called from admin dashboard with proper auth checks
 */
export const getBetaQuestionnaireResponses = query({
  args: {},
  returns: v.array(
    v.object({
      userId: v.id("users"),
      email: v.string(),
      name: v.string(),
      signupDate: v.union(v.string(), v.null()),
      responses: v.any(), // Using v.any() since the questionnaire responses are dynamic
    })
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

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
        signupDate: user.betaSignupDate ?? null,
        responses: user.betaQuestionnaireResponses,
      }));
  },
});
