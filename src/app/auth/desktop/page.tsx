'use client'

import { ClerkProvider, SignIn, useAuth, useClerk } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

const CLERK_KEY = 'pk_live_Y2xlcmsuYmFzZWlsLmFpJA'

type AuthStatus = 'sign-in' | 'exchanging' | 'done' | 'error'

function DesktopAuthInner() {
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const { signOut } = useClerk()
  const [status, setStatus] = useState<AuthStatus>('sign-in')
  const [error, setError] = useState<string | null>(null)
  const [redirectUrl, setRedirectUrl] = useState<string>('')

  // Handle ?signout query param
  useEffect(() => {
    if (!isLoaded) return
    const params = new URLSearchParams(window.location.search)
    if (params.has('signout') && isSignedIn) {
      signOut().then(() => {
        window.location.href = '/auth/desktop'
      })
    }
  }, [isLoaded, isSignedIn, signOut])

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    // Skip if signing out
    if (new URLSearchParams(window.location.search).has('signout')) return

    const redirect = async () => {
      setStatus('exchanging')
      try {
        const clerkJwt = await getToken()
        if (!clerkJwt) {
          setError('Failed to get authentication token')
          setStatus('error')
          return
        }

        // Build the full redirect URL and store it for the fallback link
        const url = `baseil://auth/callback?clerk_jwt=${encodeURIComponent(clerkJwt)}`
        setRedirectUrl(url)

        // Redirect back to Electron via custom protocol
        window.location.href = url
        setStatus('done')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
        setStatus('error')
      }
    }

    redirect()
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
          <button
            onClick={() => signOut().then(() => { window.location.href = '/auth/desktop' })}
            className="mt-6 text-[#556253] text-xs hover:text-[#C8D8C4] transition-colors"
          >
            Sign out and use a different account
          </button>
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
            onClick={() => setStatus('sign-in')}
            className="px-6 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(to right, #52B788, #40916C)' }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Sign-in form
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-medium text-[#C8D8C4] mb-1"
          style={{ fontFamily: "var(--font-newsreader), 'Newsreader', serif" }}>
          Sign in to Baseil
        </h1>
        <p className="text-[#556253] text-sm">
          for the desktop app
        </p>
      </div>

      <SignIn
        routing="hash"
        forceRedirectUrl="/auth/desktop"
        appearance={{
          layout: {
            socialButtonsVariant: 'blockButton' as const,
            socialButtonsPlacement: 'top' as const,
          },
          variables: {
            colorPrimary: '#52B788',
            colorDanger: '#ef4444',
            colorBackground: '#151d19',
            colorInputBackground: '#0d1310',
            colorInputText: '#C8D8C4',
            colorText: '#C8D8C4',
            colorTextSecondary: '#556253',
            borderRadius: '0.75rem',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.9rem',
          },
          elements: {
            rootBox: 'w-full max-w-[440px]',
            card: 'border border-[#2a3830] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.35)]',
            cardBox: 'shadow-none',
            headerTitle: 'text-[#C8D8C4] text-lg',
            headerSubtitle: 'text-[#556253] text-sm',
            socialButtonsBlockButton: 'border border-[#2a3830] bg-[#111916] rounded-xl hover:border-[#52B788]/40 hover:bg-[#52B788]/[0.06] transition-all duration-200 py-2.5',
            socialButtonsBlockButtonText: 'text-[#C8D8C4] font-medium text-sm',
            dividerLine: 'bg-[#2a3830]',
            dividerText: 'text-[#556253] text-xs',
            formFieldLabel: 'text-[#7a9476] text-xs font-medium',
            formFieldInput: 'bg-[#0d1310] border-[#2a3830] text-[#C8D8C4] rounded-xl focus:border-[#52B788]/50 placeholder:text-[#3a4a3a] py-2.5',
            formButtonPrimary: 'rounded-xl py-2.5 font-semibold text-sm bg-gradient-to-r from-[#52B788] to-[#40916C] hover:from-[#5ec592] hover:to-[#4a9e78] shadow-[0_2px_12px_rgba(82,183,136,0.25)] border border-[#52B788]/20 transition-all',
            footerActionLink: 'text-[#52B788] hover:text-[#6FCF97] font-medium',
            footerAction: 'text-[#556253]',
            footer: 'opacity-40 hover:opacity-70 transition-opacity',
          },
        }}
      />

      <p className="mt-6 text-[#556253] text-xs text-center max-w-sm">
        After signing in, you&apos;ll be redirected back to the Baseil desktop app automatically.
      </p>

      {isSignedIn && (
        <button
          onClick={() => signOut().then(() => { window.location.href = '/auth/desktop' })}
          className="mt-4 text-[#556253] text-xs hover:text-[#C8D8C4] transition-colors"
        >
          Sign out
        </button>
      )}
    </div>
  )
}

export default function DesktopAuthPage() {
  return (
    <ClerkProvider
      publishableKey={CLERK_KEY}
      signInForceRedirectUrl="/auth/desktop"
      signUpForceRedirectUrl="/auth/desktop"
    >
      <DesktopAuthInner />
    </ClerkProvider>
  )
}
