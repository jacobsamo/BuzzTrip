import type { Auth } from "@buzztrip/api";
import {
  inferAdditionalFields,
  magicLinkClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { env } from "env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: env.NEXT_PUBLIC_API_SECRET_KEY,
    },
    credentials: "include",
  },
  plugins: [inferAdditionalFields<Auth>(), magicLinkClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;
