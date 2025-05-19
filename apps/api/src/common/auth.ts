import { generateId } from "@buzztrip/db/helpers";
import * as schemas from "@buzztrip/db/schemas";
import { polar } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink, twoFactor } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { db } from "./db";
import { generateOTP } from "./generateOTP";

const client = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  // Use 'sandbox' if you're using the Polar Sandbox environment
  // Remember that access tokens, products, etc. are completely separated between environments.
  // Access tokens obtained in Production are for instance not usable in the Sandbox environment.
  server: process.env.ENVIRONMENT === "production" ? "production" : "sandbox",
  serverURL: process.env.API_URL!,
});

// TODO try and figure this out
// doesn't affect builds tho so leaving it for now
export const auth = betterAuth({
  appName: "BuzzTrip",
  baseURL: process.env.API_URL!,
  basePath: "/auth",
  secret: process.env.AUTH_SECRET!,
  trustedOrigins: [process.env.FRONT_END_URL!, process.env.API_URL!],
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"`
    schema: { ...schemas, user: schemas.users },
  }),

  // https://www.better-auth.com/docs/authentication/email-password
  // emailAndPassword: { enabled: false, requireEmailVerification: true,  },
  // emailVerification: {
  //   autoSignInAfterVerification: true,
  //   sendVerificationEmail(data, request) {
  //     rer
  //   },
  // }
  // https://www.better-auth.com/docs/concepts/oauth
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      mapProfileToUser: (profile) => {
        return {
          first_name: profile.given_name,
          last_name: profile.family_name,
        };
      },
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      tenantId: "common",
      mapProfileToUser: (profile) => {
        return {
          first_name: profile.name.split(" ")[0],
          last_name: profile.name.split(" ")[1],
        };
      },
    },
    // apple: {
    //   clientId: appleClientId,
    //   clientSecret: appleSecretKey,
    //   mapProfileToUser: (profile) => {
    //     return {
    //       first_name: profile.name.split(" ")[0],
    //       last_name: profile.name.split(" ")[1],
    //     };
    //   },
    // }
  },
  advanced: {
    database: {
      generateId: (options) => {
        return generateId("user");
      },
    },
    crossSubDomainCookies: { enabled: true },
  },
  plugins: [
    polar({
      client,
      // Enable automatic Polar Customer creation on signup
      createCustomerOnSignUp: true,
      // Enable customer portal
      enableCustomerPortal: true, // Deployed under /portal for authenticated users
      // Configure checkout
      checkout: {
        enabled: true,
        products: [
          {
            productId: "22cfed61-1e76-4368-a013-5a78c76dac3c", // ID of Product from Polar Dashboard
            slug: "free", // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
          },
          {
            productId: "244c7d4f-6b5f-46dc-a8ce-300677396b63",
            slug: "pro",
          },
          {
            productId: "9c802964-4988-4227-9c7e-c434c7701798",
            slug: "team",
          },
        ],
        successUrl: "/success?checkout_id={CHECKOUT_ID}",
      },
      // Incoming Webhooks handler will be installed at /polar/webhooks
      // webhooks: {
      //     secret: process.env.POLAR_WEBHOOK_SECRET,
      //     onPayload: ...,
      // }
    }),
    magicLink({
      generateToken: (email) => {
        const otp = generateOTP();
        return `${email}:${otp}`; // Since codes can be used only once, we'll use the email & OTP as the token
      },
      sendMagicLink: async ({ email, token, url }, request) => {
        // TODO: reimplement this
        console.log("Requesting to login using OTP", { email, token, url });
        // if (process.env.ENVIRONMENT === "development") {
        //   return;
        // }

        // try {
        //   const resend = createResend(process.env.RESEND_API_KEY!);
        //   sendEmail({
        //     resend,
        //     email: email,
        //     subject: "Verify your BuzzTrip account",
        //     react: MagicLinkVerificationEmail({
        //       email,
        //       token,
        //       callbackUrl: url,
        //     }),
        //   });
        // } catch (error) {
        //   console.error(error);
        // }
      },
      expiresIn: 60 * 10, // 10 minutes
    }),
    passkey({
      rpID: "buzztrip",
      rpName: "BuzzTrip",
      origin: "https://buzztrip.co",
    }),
    twoFactor({
      issuer: "buzztrip",
    }),
  ],

  onAPIError: {
    onError(error, ctx) {
      console.error("An error occured during auth", { error, ctx });
    },
    throw: true,
  },

  // Alter user, session, account and verification models & settings
  user: {
    modelName: "users",
    additionalFields: {
      first_name: {
        type: "string",
        fieldName: "first_name",
        required: false,
        input: false,
      },
      last_name: {
        type: "string",
        fieldName: "last_name",
        required: false,
        input: false,
      },
      username: {
        type: "string",
        fieldName: "username",
        required: false,
        input: false,
      },
      bio: {
        type: "string",
        fieldName: "bio",
        required: false,
        input: false,
      },
    },
    fields: {
      // name: "full_name",
      // image: "profile_picture",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  session: {
    modelName: "user_sessions",
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 7 days
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
  },
  verification: { modelName: "user_verifications" },
  account: {
    modelName: "user_accounts",
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true,
      trustedProviders: ["google", "microsoft", "apple", "email-password"],
    },
  },
});

// Export the inferred types
export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
