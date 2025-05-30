import {
  inferAdditionalFields,
  magicLinkClient,
  passkeyClient,
  twoFactorClient,
  adminClient
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  basePath: "/auth",
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: env.NEXT_PUBLIC_API_SECRET_KEY,
    },
    credentials: "include",
  },
  plugins: [
    inferAdditionalFields({
      user: {
        first_name: {
          type: "string",
        },
        last_name: {
          type: "string",
        },
        username: {
          type: "string",
        },
        bio: {
          type: "string",
        },
      },
    }),
    magicLinkClient(),
    twoFactorClient(),
    passkeyClient(),
    adminClient()
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;

export type Session = typeof authClient.$Infer.Session;
export type User = Session["user"];
