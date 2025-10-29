import * as z from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email(),
  subject: z.string().min(5, "Subject line is required"),
  message: z.string().min(10, "Message is required"),
});

// Beta signup schemas
export const betaQuickSignupSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Valid email is required"),
  whatsappOptIn: z.boolean().default(false),
});

export const betaQuestionnaireSchema = z.object({
  // Discovery & Background
  howDidYouHear: z.string().min(2, "Please tell us how you found BuzzTrip"),
  currentMappingTool: z.string().optional(),

  // Use Cases
  primaryUseCase: z.enum([
    "personal",
    "business",
    "education",
    "research",
    "events",
    "content-creation",
    "other",
  ], {
    required_error: "Please select your primary use case",
  }),
  useCaseDetails: z.string().optional(),

  // Frequency & Scale
  mapsPerMonth: z.enum(["1-5", "6-10", "11-25", "26-50", "50+"]).optional(),
  collaboratorsCount: z.enum(["just-me", "2-5", "6-10", "11-25", "25+"]).optional(),

  // Feature Preferences
  expectedFeatures: z.array(z.string()).min(1, "Please select at least one feature"),
  mostImportantFeature: z.string().min(2, "Please tell us your most important feature").optional(),

  // Pricing
  willingToPay: z.enum(["free-only", "0-5", "5-10", "10-20", "20-50", "50+"]),
  pricingModel: z.enum(["monthly", "yearly", "one-time", "usage-based"]).optional(),

  // Feedback & Participation
  willingToProvideHelpFeedback: z.boolean(),
  participationLevel: z.enum(["passive", "occasional", "active", "super-user"]).optional(),

  // Open-ended
  painPoints: z.string().optional(),
  dealbreakers: z.string().optional(),
  additionalComments: z.string().optional(),
});
