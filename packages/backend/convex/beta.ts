import { v } from "convex/values";
import { z } from "zod";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { authedMutation, authedQuery, zodMutation } from "./helpers";
import { getCurrentUser, mustGetCurrentUser } from "./users";

const betaQuestionnaireSchema = z.object({
  howDidYouHear: z.string(),
  primaryUseCase: z.string(),
  expectedFeatures: z.array(z.string()),
  willingToProvideHelpFeedback: z.boolean(),
  additionalComments: z.string().optional(),
});

export const submitBetaSignup = zodMutation({
  args: {
    firstName: z.string(),
    lastName: z.string().optional(),
    email: z.string().email(),
    questionnaire: betaQuestionnaireSchema,
    whatsappOptIn: z.boolean(),
    clerkUserId: z.string().optional(),
  },
  returns: z.object({
    success: z.boolean(),
    userId: z.string().optional(),
    message: z.string(),
  }),
  handler: async (ctx, args) => {
    const {
      firstName,
      lastName,
      email,
      questionnaire,
      whatsappOptIn,
      clerkUserId,
    } = args;

    // Check if user is authenticated (existing user flow)
    const currentUser = await getCurrentUser(ctx);

    if (currentUser) {
      // Existing user - update their profile with beta status
      await ctx.db.patch(currentUser._id, {
        isBetaUser: true,
        betaSignupDate: new Date().toISOString(),
        betaQuestionnaireResponses: questionnaire,
        whatsappOptIn: whatsappOptIn,
        updatedAt: new Date().toISOString(),
      });

      // Send beta welcome email
      await ctx.scheduler.runAfter(0, internal["emails-beta"].sendBetaWelcomeEmail, {
        firstName: currentUser.first_name ?? firstName,
        email: currentUser.email,
        whatsappOptIn,
      });

      return {
        success: true,
        userId: currentUser._id,
        message: "Successfully upgraded to beta user!",
      };
    } else {
      // New user flow - they need to sign up with Clerk first
      // Store their beta interest in a temporary table or return success with instructions
      return {
        success: true,
        message:
          "Thank you for your interest! Please complete sign-up to join the beta program.",
      };
    }
  },
});

export const upgradeToBeta = authedMutation({
  args: {
    questionnaire: v.any(),
    whatsappOptIn: v.boolean(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    const user = await mustGetCurrentUser(ctx);

    await ctx.db.patch(user._id, {
      isBetaUser: true,
      betaSignupDate: new Date().toISOString(),
      betaQuestionnaireResponses: args.questionnaire,
      whatsappOptIn: args.whatsappOptIn,
      updatedAt: new Date().toISOString(),
    });

    // Send beta welcome email
    await ctx.scheduler.runAfter(0, internal["emails-beta"].sendBetaWelcomeEmail, {
      firstName: user.first_name ?? user.name.split(" ")[0],
      email: user.email,
      whatsappOptIn: args.whatsappOptIn,
    });

    return {
      success: true,
      message: "Successfully upgraded to beta user!",
    };
  },
});

export const checkBetaStatus = authedQuery({
  args: {},
  returns: v.object({
    isBetaUser: v.boolean(),
    betaSignupDate: v.optional(v.string()),
  }),
  handler: async (ctx) => {
    const user = await mustGetCurrentUser(ctx);

    return {
      isBetaUser: user.isBetaUser ?? false,
      betaSignupDate: user.betaSignupDate,
    };
  },
});

export const getBetaUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const betaUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("isBetaUser"), true))
      .collect();

    return betaUsers;
  },
});
