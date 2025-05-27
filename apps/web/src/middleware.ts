import type { Session } from "@buzztrip/api/auth";
import { env } from "env";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = (await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/get-session`, {
    headers: {
      cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
      Authorization: `Bearer ${env.NEXT_PUBLIC_API_SECRET_KEY}`,
    },
  }).then((res) => res.json())) as Session | null | undefined;

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app"], // Specify the routes the middleware applies to
};
