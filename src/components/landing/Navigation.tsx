'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { BaseilLogo } from './BaseilLogo'
import { trackEvent } from '@/lib/analytics'

const SECTION_LINKS = [
  { label: 'Home', id: 'top' },
  { label: 'Install', id: 'quick-start' },
  { label: 'How it Works', id: 'how-it-works' },
]

const PAGE_LINKS = [
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Platform', href: '/platform' },
]

export function Navigation() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const scrollTo = useCallback((id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0A0F0D]/85 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-[56px] flex items-center justify-between">
          <Link href="/" className="group cursor-pointer">
            <BaseilLogo />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {SECTION_LINKS.map(item => (
              isHome ? (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="nav-link-underline text-[0.82rem] font-[var(--font-outfit)] text-[#5A7A58] hover:text-[#C8D8C4] transition-colors duration-300"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.id}
                  href={item.id === 'top' ? '/' : `/#${item.id}`}
                  className="nav-link-underline text-[0.82rem] font-[var(--font-outfit)] text-[#5A7A58] hover:text-[#C8D8C4] transition-colors duration-300"
                >
                  {item.label}
                </Link>
              )
            ))}

            {PAGE_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link-underline text-[0.82rem] font-[var(--font-outfit)] transition-colors duration-300 ${
                  pathname.startsWith(link.href)
                    ? 'text-[#C8D8C4] nav-link-active'
                    : 'text-[#5A7A58] hover:text-[#C8D8C4]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/docs/quickstart"
              onClick={() => {
                trackEvent('cta_click', { button_label: 'install', section: 'navigation' })
              }}
              className="baseil-cta-primary text-[0.8rem] px-5 py-2"
            >
              Install
            </Link>

            {/* Hamburger button — mobile only */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] group"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-[1.5px] bg-[#8FAF8A] transition-all duration-300 origin-center ${
                  mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''
                }`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-[#8FAF8A] transition-all duration-300 ${
                  mobileOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-[#8FAF8A] transition-all duration-300 origin-center ${
                  mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#0A0F0D]/95 backdrop-blur-xl md:hidden transition-all duration-300 ${
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className={`flex flex-col items-center justify-center h-full gap-6 transition-all duration-500 ${
          mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'
        }`}>
          {SECTION_LINKS.map((item, i) => (
            isHome ? (
              <button
                key={item.id}
                onClick={() => { setMobileOpen(false); scrollTo(item.id) }}
                className="text-[1.1rem] font-[var(--font-outfit)] text-[#5A7A58] hover:text-[#C8D8C4] transition-colors duration-300"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.id}
                href={item.id === 'top' ? '/' : `/#${item.id}`}
                onClick={() => setMobileOpen(false)}
                className="text-[1.1rem] font-[var(--font-outfit)] text-[#5A7A58] hover:text-[#C8D8C4] transition-colors duration-300"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {item.label}
              </Link>
            )
          ))}

          <div className="w-12 h-[1px] bg-[#52B788]/15 my-1" />

          {PAGE_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-[1.1rem] font-[var(--font-outfit)] transition-colors duration-300 ${
                pathname.startsWith(link.href) ? 'text-[#C8D8C4]' : 'text-[#5A7A58]'
              }`}
              style={{ transitionDelay: `${(i + SECTION_LINKS.length) * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}

          {/* CTA */}
          <Link
            href="/docs/quickstart"
            onClick={() => {
              trackEvent('cta_click', { button_label: 'install', section: 'mobile_navigation' })
              setMobileOpen(false)
            }}
            className="baseil-cta-primary text-[0.9rem] px-7 py-2.5 mt-2"
          >
            Install
          </Link>
        </div>
      </div>
    </>
  )
}
