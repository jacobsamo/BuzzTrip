import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/unauthorized']);
const isAdminRoute = createRouteMatcher(['/((?!sign-in|unauthorized).*)']);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes (sign-in, unauthorized)
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (isAdminRoute(req)) {
    const { userId, redirectToSignIn } = await auth();

    // Not signed in → redirect to sign-in
    if (!userId) {
      return redirectToSignIn();
    }

    // Fetch user to check admin role from publicMetadata
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Check admin access
    const userRole = user?.publicMetadata?.role;
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
