import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const secretKey = process.env.CLERK_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json(
      { error: 'Server misconfigured' },
      { status: 500 },
    )
  }

  const body = await request.json().catch(() => null)
  const email = body?.email_address?.trim()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: 'Valid email required' },
      { status: 400 },
    )
  }

  const res = await fetch('https://api.clerk.com/v1/waitlist_entries', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email_address: email }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json(
      { error: err?.errors?.[0]?.message ?? 'Failed to join waitlist' },
      { status: res.status },
    )
  }

  return NextResponse.json({ success: true })
}
