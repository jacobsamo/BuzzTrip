import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define admin email addresses as fallback
const adminEmails = ["jacob35422@gmail.com"];

// Routes that require admin access
const isProtectedRoute = createRouteMatcher([
  "/",
  "/dashboard(.*)",
  "/users(.*)",
  "/maps(.*)",
  "/analytics(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId, sessionClaims } = await auth();

    // If not authenticated, protect will redirect to sign-in
    if (!userId) {
      await auth.protect();
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId!)

    // Check admin access
    const userRole = user?.publicMetadata?.role;
    const userEmail = user.emailAddresses[0]?.emailAddress;

    // Debug logging
    console.log("Middleware Debug:", {
      userId,
      userEmail,
      userRole,
      publicMetadata: sessionClaims?.publicMetadata,
      hasAdminRole: userRole === "admin",
      isFallbackAdmin: userEmail && adminEmails.includes(userEmail),
    });

    const hasAdminRole = userRole === "admin";
    const isFallbackAdmin = userEmail && adminEmails.includes(userEmail);

    if (!hasAdminRole && !isFallbackAdmin) {
      console.log("Access denied for user:", userEmail || userId);
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    console.log("Access granted for user:", userEmail || userId);
  }
});

export const config = {
  matcher: [
    // Include all routes except Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Include all API routes
    "/(api|trpc)(.*)",
  ],
};
