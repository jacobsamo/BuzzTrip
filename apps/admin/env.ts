import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.string(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
  },
  runtimeEnv: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  },
});
