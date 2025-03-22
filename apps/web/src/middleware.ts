// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher([
//   "/auth/sign-in(.*)",
//   "/auth/sign-up(.*)",
//   "/",
//   "/api/auth/webhook",
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   if (!isPublicRoute(req)) await auth.protect();
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request, {
    // Optionally pass config if cookie name, prefix or useSecureCookies option is customized in auth config.
    cookieName: "session_token",
    cookiePrefix: "better-auth",
    // useSecureCookies: true,
  });

  console.log("Seesion cookie and more", {
    request,
    sessionCookie,
  });

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/sign-up", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app"], // Specify the routes the middleware applies to
};
