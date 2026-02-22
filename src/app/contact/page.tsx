'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/landing/Navigation'
import { Footer } from '@/components/landing/Footer'
import { ArrowLeft, Mail, Copy, Check } from 'lucide-react'

export default function ContactPage() {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  useEffect(() => { setVisible(true) }, [])

  const copyEmail = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText('support@baseil.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#C8D8C4] overflow-x-hidden">
      <Navigation />

      {/* Aurora background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[15%] right-[20%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #52B788 0%, transparent 70%)' }}
        />
      </div>
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02] baseil-grain" />

      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-[600px] mx-auto px-6">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[0.78rem] font-[var(--font-outfit)] text-[#5A7A58] hover:text-[#52B788] transition-colors duration-300 mb-12 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>

          {/* Heading */}
          <div className={`mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/50 mb-3 block">
              // Contact
            </span>
            <h1 className="font-[var(--font-newsreader)] text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.1] tracking-tight text-[#C8D8C4] mb-4">
              Get in touch.
            </h1>
            <p className="font-[var(--font-outfit)] text-[0.95rem] text-[#8FAF8A] leading-relaxed">
              Have a question, partnership inquiry, or just want to say hello? We&apos;d love to hear from you.
            </p>
          </div>

          {/* Email card */}
          <div className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <a
              href="mailto:support@baseil.com"
              className="group flex items-center gap-5 rounded-2xl border border-[#52B788]/[0.08] bg-[#111916]/60 p-6 hover:border-[#52B788]/20 hover:bg-[#111916]/80 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#52B788]/[0.08] border border-[#52B788]/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Mail size={22} className="text-[#52B788]/70 group-hover:text-[#52B788] transition-colors duration-300" />
              </div>
              <div className="flex-1">
                <p className="font-[var(--font-outfit)] text-[0.75rem] text-[#5A7A58] mb-1">Email us at</p>
                <p className="font-[var(--font-newsreader)] text-[1.2rem] text-[#C8D8C4] group-hover:text-[#52B788] transition-colors duration-300">
                  support@baseil.com
                </p>
              </div>
              <button
                onClick={copyEmail}
                className="shrink-0 w-10 h-10 rounded-lg bg-[#52B788]/[0.06] border border-[#52B788]/10 flex items-center justify-center text-[#5A7A58] hover:text-[#52B788] hover:bg-[#52B788]/[0.12] hover:border-[#52B788]/20 transition-all duration-300"
                title="Copy email"
              >
                {copied ? <Check size={16} className="text-[#52B788]" /> : <Copy size={16} />}
              </button>
            </a>
          </div>

          {/* Extra note */}
          <p className={`mt-8 font-[var(--font-outfit)] text-[0.8rem] text-[#3D5A3A] transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            For enterprise inquiries, partnerships, or support. We typically respond within 24 hours.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
