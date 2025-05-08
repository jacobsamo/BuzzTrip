import type { Auth } from "@buzztrip/api";
import {
  inferAdditionalFields,
  magicLinkClient,
  passkeyClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { env } from "env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL, // base url of our API - where the server auth handler is mounted
  basePath: "/auth", // base path that the auth handler is mounted on - API
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: env.NEXT_PUBLIC_API_SECRET_KEY, // our auth secret to access the API
    },
    credentials: "include",
  },
  plugins: [
    inferAdditionalFields<Auth>(),
    magicLinkClient(),
    twoFactorClient(),
    passkeyClient(),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;

export type Session = typeof authClient.$Infer.Session;
export type User = Session["user"];
