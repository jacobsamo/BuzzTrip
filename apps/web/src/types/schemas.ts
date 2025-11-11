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
  whatsappOptIn: z.boolean(),
});

export const betaQuestionnaireSchema = z.object({
  // Discovery & Background
  howDidYouHear: z.enum([
    "google",
    "friend",
    "social-media",
    "blog-article",
    "youtube",
    "reddit",
    "other",
  ], {
    required_error: "Please tell us how you found BuzzTrip",
  }),
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
  ], {
    required_error: "Please select your primary use case",
  }),
  useCaseDetails: z.string().optional(),

  // Frequency & Scale
  mapsPerMonth: z.enum(["1-5", "6-10", "11-25", "26-50", "50+"], {
    required_error: "Please select how many maps you'll create",
  }),
  collaboratorsCount: z.enum(["just-me", "2-5", "6-10", "11-25", "25+"], {
    required_error: "Please select how many collaborators you'll have",
  }),

  // Feature Preferences
  expectedFeatures: z.array(z.string()).min(1, "Please select at least one feature"),
  mostImportantFeature: z.string().min(2, "Please tell us your most important feature"),

  // Pricing
  willingToPay: z.enum(["free-only", "0-5", "5-10", "10-20", "20-50", "50+"], {
    required_error: "Please select your budget",
  }),
  pricingModel: z.enum(["monthly", "yearly", "one-time", "usage-based"], {
    required_error: "Please select your preferred pricing model",
  }),

  // Feedback & Participation
  willingToProvideHelpFeedback: z.boolean(),
  participationLevel: z.enum(["passive", "occasional", "active", "super-user"], {
    required_error: "Please select your participation level",
  }),

  // Open-ended
  painPoints: z.string().optional(),
  dealbreakers: z.string().optional(),
  additionalComments: z.string().optional(),
});
