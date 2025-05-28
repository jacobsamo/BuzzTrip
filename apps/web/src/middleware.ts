import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request); // this handles getting the secure cookie __Secure-better-auth.
  console.log("Trying to get session cookie:", {
    sessionCookie,
    cookies: request.cookies,
  });

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app"],
};
