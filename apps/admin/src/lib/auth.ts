import { auth } from "@clerk/nextjs/server";
import { type NextjsOptions } from "convex/nextjs";
import { env } from "../../env";

/**
 * Get Clerk JWT token for Convex authentication
 */
export async function getAuthToken() {
  const session = await auth();
  const token = await session.getToken({ template: "convex" });
  return token ?? undefined;
}

/**
 * Get Convex options with authentication for server components
 */
export async function convexNextjsOptions(): Promise<NextjsOptions> {
  const token = await getAuthToken();
  return {
    url: env.NEXT_PUBLIC_CONVEX_URL,
    token,
  };
}
