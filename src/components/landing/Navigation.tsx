'use client'

import { useState, useEffect } from 'react'
import { DbzeroLogo } from './DbzeroLogo'
import { Github, Star } from 'lucide-react'

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#060610]/80 backdrop-blur-xl border-b border-white/[0.04]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
        <DbzeroLogo />

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Problem', id: 'problem' },
            { label: 'Demo', id: 'sandbox' },
            { label: 'How it works', id: 'how-it-works' },
            { label: 'Open Source', id: 'pricing' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-[0.85rem] font-[var(--font-dm-sans)] text-[#8a8a9a] hover:text-[#e8e6e3] transition-colors duration-300"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/dbzero-ai/dbzero"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[0.8rem] font-[var(--font-dm-sans)] text-[#8a8a9a] hover:text-[#e8e6e3] transition-colors duration-300"
          >
            <Github size={16} />
            <Star size={12} className="text-amber-400/70" />
            <span>Star</span>
          </a>
          <a
            href="#early-access"
            onClick={(e) => { e.preventDefault(); scrollTo('early-access') }}
            className="landing-cta-primary text-[0.8rem] px-5 py-2"
          >
            Request Early Access
          </a>
        </div>
      </div>
    </nav>
  )
}
