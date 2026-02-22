'use client'

import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

const CLERK_KEY = 'pk_live_Y2xlcmsuYmFzZWlsLmFpJA'

type PageStatus = 'loading' | 'exchanging' | 'done' | 'error'

function DesktopAuthInner() {
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const [status, setStatus] = useState<PageStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [redirectUrl, setRedirectUrl] = useState<string>('')

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      // Redirect to Clerk Account Portal for sign-in.
      // After sign-in, Clerk redirects back here with an active session cookie
      // on .baseil.ai — ClerkProvider picks it up client-side.
      const returnUrl = window.location.origin + '/auth/desktop'
      window.location.href = `https://accounts.baseil.ai/sign-in?redirect_url=${encodeURIComponent(returnUrl)}`
      return
    }

    // Signed in — get Clerk JWT and redirect to Electron
    const exchangeToken = async () => {
      setStatus('exchanging')
      try {
        const clerkJwt = await getToken()
        if (!clerkJwt) {
          setError('Failed to get authentication token')
          setStatus('error')
          return
        }

        const url = `baseil://auth/callback?clerk_jwt=${encodeURIComponent(clerkJwt)}`
        setRedirectUrl(url)
        window.location.href = url
        setStatus('done')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
        setStatus('error')
      }
    }

    exchangeToken()
  }, [isLoaded, isSignedIn, getToken])

  // Done — redirecting to Electron
  if (status === 'done') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-[#52B788]/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#52B788]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-[#C8D8C4] mb-2"
            style={{ fontFamily: "var(--font-newsreader), 'Newsreader', serif" }}>
            Signed in successfully
          </h1>
          <p className="text-[#556253] text-sm">
            Redirecting back to the Baseil desktop app...
          </p>
          <p className="text-[#556253] text-xs mt-4">
            If the app doesn&apos;t open automatically,{' '}
            <a href={redirectUrl} className="text-[#52B788] hover:text-[#6FCF97]">
              click here
            </a>
          </p>
        </div>
      </div>
    )
  }

  // Exchanging token
  if (status === 'exchanging') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="animate-pulse mb-4">
          <div className="w-10 h-10 rounded-full bg-[#52B788]/20" />
        </div>
        <p className="text-[#556253] text-sm">Completing sign-in...</p>
      </div>
    )
  }

  // Error
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-md">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(to right, #52B788, #40916C)' }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Loading / checking auth state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="animate-pulse mb-4">
        <div className="w-10 h-10 rounded-full bg-[#52B788]/20" />
      </div>
      <p className="text-[#556253] text-sm">Loading...</p>
    </div>
  )
}

export default function DesktopAuthPage() {
  return (
    <ClerkProvider publishableKey={CLERK_KEY}>
      <DesktopAuthInner />
    </ClerkProvider>
  )
}
