import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/",
  "/dashboard(.*)",
  "/users(.*)",
  "/maps(.*)",
  "/analytics(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // If it's a public route, allow access
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // If user is not authenticated, redirect to sign-in
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // For admin routes, check if user is an admin
  if (isAdminRoute(req)) {
    const userEmail = sessionClaims?.email as string;

    // Define admin users (you can also use Clerk's metadata or roles)
    const adminEmails = [
      "admin@buzztrip.co",
      // Add more admin emails as needed
    ];

    if (!adminEmails.includes(userEmail)) {
      // Redirect non-admin users to an unauthorized page or home
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};