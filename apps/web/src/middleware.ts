import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Only protect /app routes
const isProtectedRoute = createRouteMatcher(['/app(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Include all routes except Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Include all API routes
    '/(api|trpc)(.*)',
    // Include /app routes (already covered above)
    '/app(.*)',
  ],
}
