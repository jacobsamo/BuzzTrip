import { generateId } from "@buzztrip/db/helpers";
import * as schemas from "@buzztrip/db/schemas";
import MagicLinkVerificationEmail from "@buzztrip/transactional/emails/magic-link";
import { createResend, sendEmail } from "@buzztrip/transactional/helpers";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { db } from "./db";
import { generateOTP } from "./generateOTP";

export const auth = betterAuth({
  appName: "BuzzTrip",
  baseURL: process.env.API_URL,
  basePath: "/auth",
  secret: process.env.AUTH_SECRET,
  trustedOrigins: [process.env.FRONT_END_URL, process.env.API_URL],
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"`
    schema: { ...schemas, user: schemas.users },
  }),

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
      name: "full_name",
      image: "profile_picture",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  session: {
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
  plugins: [
    magicLink({
      generateToken: (email) => {
        const otp = generateOTP();
        return `${email}:${otp}`; // Since codes can be used only once, we'll use the email & OTP as the token
      },
      sendMagicLink: async ({ email, token, url }, request) => {
        // TODO: make it so if in dev we just console.log it
        console.log("Requesting to login using OTP", { email, token, url });

        try {
          const resend = createResend(process.env.RESEND_API_KEY);
          sendEmail({
            resend,
            email: email,
            subject: "Verify your BuzzTrip account",
            react: MagicLinkVerificationEmail({
              email,
              token,
              callbackUrl: url,
            }),
          });
        } catch (error) {
          console.error(error);
        }
      },
      expiresIn: 60 * 10, // 10 minutes
    }),
  ],
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
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: (profile) => {
        console.log("Google profile:", profile);
        return {
          first_name: profile.given_name,
          last_name: profile.family_name,
        };
      },
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      tenantId: "common",
      requireSelectAccount: true,
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
  onAPIError: {
    onError(error, ctx) {
      console.error("An error occured during auth", { error, ctx });
    },
    throw: true,
  },
});

export type Auth = typeof auth;
