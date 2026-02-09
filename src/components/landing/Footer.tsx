'use client'

import { useState } from 'react'
import { BaseilLogo } from './BaseilLogo'
import { Github, Twitter, ArrowRight, Loader2, Check } from 'lucide-react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  return (
    <footer id="early-access" className="relative pt-28 pb-12 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#52B788]/10 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,_rgba(82,183,136,0.04)_0%,_transparent_60%)]" />

      <div className="max-w-[700px] mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="font-[var(--font-newsreader)] text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#C8D8C4] leading-tight mb-3">
            Request Early Access
          </h2>
          <p className="font-[var(--font-outfit)] text-[0.9rem] text-[#5A7A58] mb-8">
            Be among the first to try baseil. We&apos;ll reach out when your spot is ready.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-[440px] mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="flex-1 bg-[#111916]/60 border border-[#52B788]/10 rounded-full px-5 py-3 text-[0.85rem] font-[var(--font-outfit)] text-[#C8D8C4] placeholder:text-[#3D5A3A] focus:outline-none focus:border-[#52B788]/25 focus:bg-[#111916]/80 transition-all duration-300"
              />
              <button
                type="submit"
                disabled={loading}
                className="baseil-cta-primary px-6 py-3 text-[0.85rem] flex items-center gap-2"
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
                { label: 'Docs', href: '#' },
                { label: 'GitHub', href: '#', icon: Github },
                { label: 'Twitter', href: '#', icon: Twitter },
                { label: 'Discord', href: '#' },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="flex items-center gap-1.5 text-[0.75rem] font-[var(--font-outfit)] text-[#3D5A3A] hover:text-[#8FAF8A] transition-colors duration-300"
                >
                  {link.icon && <link.icon size={13} />}
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="font-[var(--font-newsreader)] text-[1.1rem] text-[#3D5A3A]/60 italic">
              one intelligent layer. all your data.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
