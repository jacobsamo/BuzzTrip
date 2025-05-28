import { betterFetch } from "@better-fetch/fetch";
import { env } from "env";
import { NextRequest, NextResponse } from "next/server";
import type { Session } from "./lib/auth-client";

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/auth/get-session",
    {
      baseURL: env.NEXT_PUBLIC_API_URL,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
        Authorization: `Bearer ${env.NEXT_PUBLIC_API_SECRET_KEY}`,
      },
    }
  );

  console.log("Session", session);

  if (!session) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app"],
};
