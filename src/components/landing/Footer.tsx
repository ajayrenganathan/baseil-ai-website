'use client'

import { useState, useRef, useEffect } from 'react'
import { BaseilLogo } from './BaseilLogo'
import { Github, ArrowRight, Loader2, Check } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

export function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const taglineRef = useRef<HTMLDivElement>(null)
  const [taglineVisible, setTaglineVisible] = useState(false)

  useEffect(() => {
    const el = taglineRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTaglineVisible(true)
          trackEvent('section_view', { section_name: 'footer' })
        }
      },
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    trackEvent('cta_click', { button_label: 'join_waitlist', section: 'footer' })
    if (!email.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_address: email }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer id="early-access" className="relative pt-28 pb-12 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#52B788]/10 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,_rgba(82,183,136,0.04)_0%,_transparent_60%)]" />

      {/* Aurora glow blobs */}
      <div
        className="absolute top-16 left-1/4 w-[500px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(82, 183, 136, 0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'aurora-drift-1 20s ease-in-out infinite',
          opacity: 0.05,
        }}
      />
      <div
        className="absolute bottom-20 right-1/4 w-[400px] h-[250px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(111, 207, 151, 0.06) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'aurora-drift-2 25s ease-in-out infinite',
          opacity: 0.04,
        }}
      />

      <div className="relative z-10 max-w-[700px] mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-[var(--font-newsreader)] text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#C8D8C4] leading-tight mb-3">
            Join the Waitlist
          </h2>
          <p className="font-[var(--font-outfit)] text-[0.9rem] text-[#5A7A58] mb-8">
            Get early access to Teams, Enterprise, and Cloud. We&apos;ll reach out when your spot is ready.
          </p>

          {!submitted ? (
            <>
              <form onSubmit={handleSubmit} className="flex gap-3 max-w-[440px] mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="you@company.com"
                  required
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore
                  className="flex-1 bg-[#111916]/60 border border-[#52B788]/10 rounded-full px-5 py-3 text-[0.85rem] font-[var(--font-outfit)] text-[#C8D8C4] placeholder:text-[#3D5A3A] focus:outline-none focus:border-[#52B788]/25 focus:bg-[#111916]/80 transition-all duration-300"
                  style={{
                    boxShadow: inputFocused
                      ? '0 0 20px rgba(82, 183, 136, 0.15), 0 0 40px rgba(82, 183, 136, 0.05), inset 0 0 10px rgba(82, 183, 136, 0.03)'
                      : 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="baseil-cta-primary px-6 py-3 text-[0.85rem] flex items-center gap-2 transition-transform duration-300 hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      Join Waitlist
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
              {error && (
                <p className="mt-3 text-[0.8rem] font-[var(--font-outfit)] text-red-400">{error}</p>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center gap-2 text-[#52B788] font-[var(--font-outfit)] text-[0.9rem]">
              <Check size={18} />
              <span>You&apos;re on the list. We&apos;ll be in touch.</span>
            </div>
          )}
        </div>

        <div className="border-t border-[#52B788]/[0.06] pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <BaseilLogo />

            <div className="flex items-center gap-6">
              {[
                { label: 'Docs', href: '/docs', external: false },
                { label: 'Contact', href: '/contact', external: false },
                { label: 'GitHub', href: '#', icon: Github, external: true },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="flex items-center gap-1.5 text-[0.75rem] font-[var(--font-outfit)] text-[#3D5A3A] hover:text-[#52B788] transition-all duration-300 hover:scale-105"
                  {...(link.external
                    ? {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        onClick: () =>
                          trackEvent('outbound_click', {
                            url: link.href,
                            link_text: link.label.toLowerCase(),
                          }),
                      }
                    : {})}
                >
                  {link.icon && <link.icon size={13} />}
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div ref={taglineRef} className="text-center mt-10 overflow-hidden">
            <p
              className={`baseil-text-shimmer font-[var(--font-newsreader)] text-[1.1rem] italic ${
                taglineVisible ? 'animate-tagline-zoom' : 'opacity-0 scale-150'
              }`}
            >
              The data agent that speaks human and machine.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
