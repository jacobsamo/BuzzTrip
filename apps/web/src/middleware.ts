import { betterFetch } from "@better-fetch/fetch";
import { getSessionCookie } from "better-auth/cookies";
import { env } from "env";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { authClient, type Session } from "./lib/auth-client";

export async function middleware(request: NextRequest) {
  const cookies = request.headers.get("cookie");
  const requestHeaders = new Headers(request.headers);
  const sessionViaHeaders = await getSessionCookie(requestHeaders);
  const sessionViaRequest = await getSessionCookie(request);
  const authClientTest = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  const data = await betterFetch<Session>("/auth/get-session", {
    baseURL: env.NEXT_PUBLIC_API_URL,
    headers: {
      cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
      Authorization: `Bearer ${env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
    credentials: "include",
  });

  console.log("data", {
    data,
    cookies,
    sessionViaHeaders,
    sessionViaRequest,
    authClientTest,
    request,
  });

  if (
    !sessionViaHeaders ||
    !sessionViaRequest ||
    !authClientTest ||
    data.error ||
    !data.data.session
  ) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/app"],
};
