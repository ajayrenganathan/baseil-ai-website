'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/landing/Navigation'
import { Footer } from '@/components/landing/Footer'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'

export default function DocsPage() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setVisible(true) }, [])

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#C8D8C4] overflow-x-hidden">
      <Navigation />

      {/* Aurora background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[10%] left-[30%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #52B788 0%, transparent 70%)' }}
        />
      </div>
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02] baseil-grain" />

      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[0.78rem] font-[var(--font-outfit)] text-[#5A7A58] hover:text-[#52B788] transition-colors duration-300 mb-12 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>

          {/* Badge */}
          <div className={`mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#52B788]/20 bg-[#52B788]/[0.05] text-[0.72rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]">
              <Sparkles size={12} className="animate-pulse" />
              Coming Soon
            </span>
          </div>

          {/* Mascot */}
          <div className={`mb-6 transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Image
              src="/robot/robot-front-left.png"
              alt="Baseil mascot"
              width={140}
              height={170}
              priority
              className="mx-auto select-none pointer-events-none drop-shadow-[0_0_30px_rgba(82,183,136,0.15)] mascot-float"
              style={{ objectFit: 'contain', height: 'auto' }}
            />
          </div>

          {/* Heading */}
          <h1 className={`font-[var(--font-newsreader)] text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.1] tracking-tight mb-4 gradient-text-animated glow-text transition-all duration-1000 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Documentation
          </h1>

          <p className={`font-[var(--font-outfit)] text-[0.95rem] leading-relaxed text-[#8FAF8A] max-w-[480px] mx-auto mb-4 transition-all duration-700 delay-[600ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            We&apos;re writing docs as fast as our mascot can type.
            <br />
            Spoiler: those little hands aren&apos;t great with keyboards.
          </p>

          <p className={`font-[var(--font-newsreader)] text-[1rem] italic text-[#5A7A58] mb-10 transition-all duration-700 delay-[800ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Guides, API references, and tutorials are on the way.
          </p>

          {/* CTA */}
          <div className={`flex items-center justify-center gap-3 transition-all duration-700 delay-[1000ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              href="/#early-access"
              className="baseil-cta-primary text-[0.85rem] px-6 py-2.5 flex items-center gap-2"
            >
              Join the Waitlist
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/"
              className="baseil-cta-ghost text-[0.85rem] px-6 py-2.5"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
