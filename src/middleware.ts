import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isAuthRoute = createRouteMatcher(['/auth/(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Auth pages handle their own ClerkProvider — don't protect them
  if (!isAuthRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/auth/:path*'],
}
