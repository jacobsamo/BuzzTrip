import { getSessionCookie } from "better-auth/cookies";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const headerList = await headers();
  const sessionCookie = getSessionCookie(headerList); // this handles getting the secure cookie __Secure-better-auth.
  console.log("Trying to get session cookie:", {
    sessionCookie,
    headers: headerList,
    request: request
  });

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app"],
};
