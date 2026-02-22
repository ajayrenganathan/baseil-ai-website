'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { BaseilLogo } from './BaseilLogo'

const SECTIONS = [
  { label: 'Home', id: 'top' },
  { label: 'How it Works', id: 'how-it-works' },
  { label: 'Capabilities', id: 'capabilities' },
  { label: 'Demo', id: 'sandbox' },
]

export function Navigation() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('top')

  // Scroll tracking
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

  // Scroll spy — track which section is in view
  useEffect(() => {
    if (!isHome) return

    const sectionIds = SECTIONS.map(s => s.id).filter(id => id !== 'top')
    const observers: IntersectionObserver[] = []

    const handleIntersect = (id: string) => (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(id)
        }
      })
    }

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) {
        const observer = new IntersectionObserver(handleIntersect(id), {
          rootMargin: '-40% 0px -55% 0px',
        })
        observer.observe(el)
        observers.push(observer)
      }
    })

    // Track "top" — if scrolled to near top, mark Home as active
    const topCheck = () => {
      if (window.scrollY < 200) setActiveSection('top')
    }
    window.addEventListener('scroll', topCheck, { passive: true })

    return () => {
      observers.forEach(o => o.disconnect())
      window.removeEventListener('scroll', topCheck)
    }
  }, [isHome])

  const scrollTo = useCallback((id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

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
          <Link href="/" className="group cursor-pointer">
            <BaseilLogo />
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {/* Landing page sections */}
            {SECTIONS.map(item => (
              isHome ? (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`nav-link-underline text-[0.82rem] font-[var(--font-outfit)] transition-colors duration-300 ${
                    activeSection === item.id
                      ? 'text-[#C8D8C4] nav-link-active'
                      : 'text-[#5A7A58] hover:text-[#C8D8C4]'
                  }`}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.id}
                  href={`/#${item.id === 'top' ? '' : item.id}`}
                  className="nav-link-underline text-[0.82rem] font-[var(--font-outfit)] text-[#5A7A58] hover:text-[#C8D8C4] transition-colors duration-300"
                >
                  {item.label}
                </Link>
              )
            ))}

            {/* Pricing page link */}
            <Link
              href="/pricing"
              className={`nav-link-underline text-[0.82rem] font-[var(--font-outfit)] transition-colors duration-300 ${
                pathname === '/pricing'
                  ? 'text-[#C8D8C4] nav-link-active'
                  : 'text-[#5A7A58] hover:text-[#C8D8C4]'
              }`}
            >
              Pricing
            </Link>

            {/* Blog page link — hidden for now, needs work */}

            {/* Platform page link */}
            <Link
              href="/platform"
              className={`nav-link-underline text-[0.82rem] font-[var(--font-outfit)] transition-colors duration-300 ${
                pathname === '/platform'
                  ? 'text-[#C8D8C4] nav-link-active'
                  : 'text-[#5A7A58] hover:text-[#C8D8C4]'
              }`}
            >
              Platform
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={isHome ? '#early-access' : '/#early-access'}
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault()
                  scrollTo('early-access')
                }
              }}
              className="baseil-cta-primary text-[0.8rem] px-5 py-2"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}
