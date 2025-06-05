import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionViaRequest = await getSessionCookie(request);

  if (!sessionViaRequest) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // runtime: "nodejs",
  matcher: ["/app"],
};
