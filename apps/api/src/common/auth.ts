import { createDb } from "@buzztrip/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { generateOTP } from "./generateOTP";

export const createAuth = (
  baseUrl: string,
  authSecret: string,
  googleClientId: string,
  googleClientSecret: string,
  url: string,
  authToken: string
) => {
  const db = createDb(url, authToken);

  return betterAuth({
    appName: "BuzzTrip",
    baseURL: baseUrl,
    secret: authSecret,
    database: drizzleAdapter(db, {
      provider: "sqlite", // or "mysql", "sqlite"`
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
          fieldName: "first_name",
          required: false,
          input: false,
        },
        //TODO: remove if it works correctly
        // full_name: {
        //   type: "string",
        //   fieldName: "full_name",
        //   required: false,
        //   input: false,
        // },
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
    // https://www.better-auth.com/docs/concepts/session-management#session-caching
    session: {
      modelName: "user_sessions",
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 minutes
      },
    },
    verification: {
      modelName: "user_verifications",
    },
    account: {
      modelName: "user_accounts",
      accountLinking: {
        enabled: true,
        trustedProviders: ["google", "microsoft", "apple"],
      },
    },

    plugins: [
      magicLink({
        generateToken: (email) => {
          // TODO: enhance this to be more secure e.g add the email into the mix
          return generateOTP();
        },
        sendMagicLink: async ({ email, token, url }, request) => {
          console.log("Requesting to login using OTP", {
            email,
            token,
            url,
          });
          //TODO: Setup resend to send these emails to users, for now just console.log it
        },
      }),
    ],
    // https://www.better-auth.com/docs/concepts/oauth
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        mapProfileToUser: (profile) => {
          return {
            first_name: profile.given_name,
            last_name: profile.family_name,
          };
        },
      },
      // microsoft: {
      //   clientId: microsoftClientId,
      //   clientSecret: microsoftScretKey,
      //   mapProfileToUser: (profile) => {
      //     return {
      //       first_name: profile.name.split(" ")[0],
      //       last_name: profile.name.split(" ")[1],
      //     };
      //   },
      // },
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
      //TODO: if id's aren't quite what we want than use our own generateId function for db
      // generateId: false,
      crossSubDomainCookies: {
        enabled: true,
      },
    },
    // https://www.better-auth.com/docs/authentication/email-password
    // emailAndPassword: {
    //   enabled: true,
    // },
  });
};

export type Auth = ReturnType<typeof createAuth>;