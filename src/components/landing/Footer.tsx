'use client'

import { useState } from 'react'
import { DataDamLogo } from './DataDamLogo'
import { Github, Twitter, ArrowRight, Loader2, Check } from 'lucide-react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    // Simulate submission
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  return (
    <footer id="early-access" className="relative pt-28 pb-12 overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,_rgba(14,230,212,0.03)_0%,_transparent_60%)]" />

      <div className="max-w-[700px] mx-auto px-6">
        {/* Email capture */}
        <div className="text-center mb-20">
          <h2 className="font-[var(--font-instrument-serif)] text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#e8e6e3] leading-tight mb-3">
            Request Early Access
          </h2>
          <p className="font-[var(--font-dm-sans)] text-[0.9rem] text-[#5a5a6a] mb-8">
            Be among the first to try DataDam. We&apos;ll reach out when your spot is ready.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-[440px] mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-[0.85rem] font-[var(--font-dm-sans)] text-[#c8c8d8] placeholder:text-[#3a3a4a] focus:outline-none focus:border-[#0ee6d4]/20 transition-all duration-300"
              />
              <button
                type="submit"
                disabled={loading}
                className="landing-cta-primary px-6 py-3 text-[0.85rem] flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    Get Access
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-[#0ee6d4] font-[var(--font-dm-sans)] text-[0.9rem]">
              <Check size={18} />
              <span>You&apos;re on the list. We&apos;ll be in touch.</span>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.04] pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <DataDamLogo />

            <div className="flex items-center gap-6">
              {[
                { label: 'Docs', href: '#' },
                { label: 'GitHub', href: '#', icon: Github },
                { label: 'Twitter', href: '#', icon: Twitter },
                { label: 'Discord', href: '#' },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="flex items-center gap-1.5 text-[0.75rem] font-[var(--font-dm-sans)] text-[#4a4a5a] hover:text-[#8a8a9a] transition-colors duration-300"
                >
                  {link.icon && <link.icon size={13} />}
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Tagline sign-off */}
          <div className="text-center mt-10">
            <p className="font-[var(--font-instrument-serif)] text-[1.1rem] text-[#2a2a3a] italic">
              one intelligent layer. all your data.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
