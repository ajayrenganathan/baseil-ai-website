'use client'

import { useState, useEffect } from 'react'
import { BaseilLogo } from './BaseilLogo'
import { Github, Star } from 'lucide-react'

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0A0F0D]/85 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-[56px] flex items-center justify-between">
          <div className="group cursor-pointer">
            <BaseilLogo />
          </div>

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
                className="nav-link-underline text-[0.85rem] font-[var(--font-outfit)] text-[#5A7A58] hover:text-[#C8D8C4] transition-colors duration-300"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/baseil-ai/baseil"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link-underline flex items-center gap-2 text-[0.8rem] font-[var(--font-outfit)] text-[#5A7A58] hover:text-[#C8D8C4] transition-colors duration-300"
            >
              <Github size={16} />
              <Star size={12} className="text-[#52B788]/60" />
              <span>Star</span>
            </a>
            <a
              href="#early-access"
              onClick={(e) => { e.preventDefault(); scrollTo('early-access') }}
              className="baseil-cta-primary text-[0.8rem] px-5 py-2"
            >
              Request Early Access
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}
