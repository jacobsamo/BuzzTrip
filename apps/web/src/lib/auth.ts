import { api } from "@buzztrip/backend/api";
import { auth } from "@clerk/nextjs/server";
import { type NextjsOptions, fetchQuery } from "convex/nextjs";
import { env } from "env";

export async function getAuthToken() {
  const session = await auth();
  const token = await session.getToken({ template: "convex" });
  return token ?? undefined;
}

export async function convexNextjsOptions(): Promise<NextjsOptions> {
  const token = await getAuthToken();
  return {
    url: env.NEXT_PUBLIC_CONVEX_URL,
    token: token,
  };
}

export async function getConvexServerSession() {
  const options = await convexNextjsOptions();
  return await fetchQuery(api.users.userLoginStatus, {}, options);
}
