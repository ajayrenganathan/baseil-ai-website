import { NextRequest, NextResponse } from 'next/server'

/**
 * Clerk Frontend API proxy.
 *
 * Desktop (Electron) app runs on app:// origin which Clerk production
 * rejects. This proxy rewrites /__clerk/* requests to Clerk's
 * Frontend API at the edge, adding required proxy headers + CORS.
 *
 * Required env var on Vercel: CLERK_SECRET_KEY
 */

const CLERK_FAPI = 'https://frontend-api.clerk.dev'
const PROXY_URL = 'https://baseil.ai/__clerk/'

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': 'app://-',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true',
}

export function proxy(req: NextRequest) {
  // Only handle /__clerk paths
  if (!req.nextUrl.pathname.startsWith('/__clerk')) {
    return NextResponse.next()
  }

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
  }

  // Strip /__clerk prefix and rewrite to Clerk Frontend API
  const clerkPath = req.nextUrl.pathname.replace(/^\/__clerk/, '') || '/'
  const destination = new URL(clerkPath, CLERK_FAPI)
  destination.search = req.nextUrl.search

  // Add required Clerk proxy headers to the forwarded request
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('Clerk-Proxy-Url', PROXY_URL)
  requestHeaders.set('Clerk-Secret-Key', process.env.CLERK_SECRET_KEY || '')

  // Replace Electron's app:// origin with baseil.ai so Clerk accepts the request
  requestHeaders.set('Origin', 'https://baseil.ai')
  requestHeaders.set('Referer', 'https://baseil.ai/')
  requestHeaders.set(
    'X-Forwarded-For',
    req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1'
  )

  // Rewrite to Clerk FAPI with proxy headers, add CORS to response
  const response = NextResponse.rewrite(destination, {
    request: { headers: requestHeaders },
  })

  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    response.headers.set(key, value)
  }

  return response
}

export const config = {
  // Match all /__clerk paths (including /__clerk itself)
  matcher: ['/__clerk', '/__clerk/:path*'],
}
