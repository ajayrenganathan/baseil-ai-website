import { NextRequest, NextResponse } from 'next/server'

/**
 * Clerk Frontend API proxy.
 *
 * Desktop (Electron) app runs on app:// origin which Clerk production
 * rejects. This route proxies Clerk API calls through baseil.ai so the
 * origin check passes.
 *
 * Required env var on Vercel: CLERK_SECRET_KEY
 */

const CLERK_FAPI = 'https://frontend-api.clerk.dev'
const PROXY_URL = 'https://baseil.ai/__clerk/'

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': '*',
}

async function proxyToClerk(req: NextRequest, path: string[]) {
  const clerkPath = '/' + (path ?? []).join('/')
  const url = new URL(clerkPath, CLERK_FAPI)
  url.search = req.nextUrl.search

  const headers = new Headers()

  // Forward select headers from the original request
  const forwardHeaders = [
    'content-type',
    'authorization',
    'cookie',
    'clerk-backend-api-version',
    'user-agent',
  ]
  for (const h of forwardHeaders) {
    const val = req.headers.get(h)
    if (val) headers.set(h, val)
  }

  // Required Clerk proxy headers
  headers.set('Clerk-Proxy-Url', PROXY_URL)
  headers.set('Clerk-Secret-Key', process.env.CLERK_SECRET_KEY || '')
  headers.set(
    'X-Forwarded-For',
    req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1'
  )

  const body =
    req.method !== 'GET' && req.method !== 'HEAD'
      ? await req.arrayBuffer()
      : undefined

  const response = await fetch(url.toString(), {
    method: req.method,
    headers,
    body,
  })

  const responseHeaders = new Headers(response.headers)
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    responseHeaders.set(key, value)
  }

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  })
}

// Next.js 16 App Router: params is a Promise
type RouteContext = { params: Promise<{ path?: string[] }> }

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function GET(req: NextRequest, ctx: RouteContext) {
  const { path = [] } = await ctx.params
  return proxyToClerk(req, path)
}

export async function POST(req: NextRequest, ctx: RouteContext) {
  const { path = [] } = await ctx.params
  return proxyToClerk(req, path)
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const { path = [] } = await ctx.params
  return proxyToClerk(req, path)
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  const { path = [] } = await ctx.params
  return proxyToClerk(req, path)
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const { path = [] } = await ctx.params
  return proxyToClerk(req, path)
}
