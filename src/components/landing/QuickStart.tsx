'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy, ChevronRight } from 'lucide-react'
import { INSTALL_COMMAND, DESKTOP_DMG_URL } from '@/lib/install'

type InstallTab = 'one-liner' | 'desktop'

interface TabContent {
  comment: string
  command: string
  caption: string
  secondary?: string
}

const TAB_CONTENT: Record<InstallTab, TabContent> = {
  'one-liner': {
    comment: '# Downloads the binary, then runs baseil setup.',
    command: INSTALL_COMMAND,
    caption: 'macOS Apple Silicon and Linux x64. The installer downloads about 300 MB, then the setup wizard asks for your account, an AI key, and a database.',
  },
  'desktop': {
    comment: '# Install the server, then download the desktop app.',
    command: INSTALL_COMMAND,
    secondary: `open ${DESKTOP_DMG_URL}`,
    caption: 'macOS arm64 DMG. The desktop app connects to your local or remote baseil server.',
  },
}

export function QuickStart() {
  const [activeTab, setActiveTab] = useState<InstallTab>('one-liner')
  const [copied, setCopied] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const current = TAB_CONTENT[activeTab]

  const handleCopy = async () => {
    const text = current.secondary
      ? `${current.command}\n${current.secondary}`
      : current.command
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can fail in insecure contexts; silently ignore.
    }
  }

  return (
    <section
      ref={sectionRef}
      id="quick-start"
      className="relative py-24 px-6"
    >
      {/* Subtle aurora */}
      <div
        className="absolute top-[20%] right-[15%] w-[450px] h-[450px] rounded-full blur-[120px] opacity-[0.05] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #52B788 0%, transparent 70%)' }}
      />

      <div className="relative max-w-[1100px] mx-auto">
        {/* Section label */}
        <div className={`flex items-center gap-2 mb-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <ChevronRight size={16} className="text-[#52B788]" />
          <h2 className="font-[var(--font-outfit)] text-[0.78rem] uppercase tracking-[0.25em] text-[#52B788]">
            Quick Start
          </h2>
        </div>

        {/* Heading */}
        <p className={`font-[var(--font-newsreader)] text-[clamp(1.5rem,3vw,2.2rem)] text-[#C8D8C4] leading-tight mb-4 max-w-[620px] transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Install, then a two-minute setup wizard.
        </p>

        {/* Trust pills */}
        <div className={`flex flex-wrap items-center gap-2.5 mb-8 transition-all duration-700 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {['Runs on your machine', 'Read-only by default', 'SQL shown for every answer'].map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.72rem] font-[var(--font-outfit)] text-[#6FCF97] bg-[#52B788]/8 border border-[#52B788]/15"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
                <path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {tag}
            </span>
          ))}
        </div>

        {/* Terminal card */}
        <div
          className={`relative rounded-2xl overflow-hidden border border-[#52B788]/15 bg-[#0D1410] shadow-[0_0_60px_-20px_rgba(82,183,136,0.35)] transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-4 px-4 py-3 border-b border-[#52B788]/10 bg-[#0A0F0D]/60 flex-wrap">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]/60" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/60" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]/60" />
            </div>

            {/* Install-type tabs (left) */}
            <div className="flex items-center gap-1 ml-2">
              {(['one-liner', 'desktop'] as const).map(tab => {
                const active = activeTab === tab
                const label = tab === 'one-liner' ? 'One-liner' : 'Desktop'
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-md text-[0.72rem] font-[var(--font-outfit)] transition-colors duration-200 ${
                      active
                        ? 'bg-[#52B788]/15 text-[#6FCF97] border border-[#52B788]/30'
                        : 'text-[#5A7A58] hover:text-[#8FAF8A] border border-transparent'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Terminal body */}
          <div className="relative p-6 font-mono text-[0.88rem] leading-[1.8]">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2 rounded-md bg-[#111916]/60 border border-[#52B788]/10 text-[#5A7A58] hover:text-[#6FCF97] hover:border-[#52B788]/30 transition-colors duration-200"
              aria-label={copied ? 'Copied' : 'Copy command'}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>

            {/* Comment */}
            <div className="text-[#5A7A58] italic mb-2">
              {current.comment}
            </div>

            {/* Primary command */}
            <div className="flex items-start gap-2">
              <span className="text-[#52B788] shrink-0">$</span>
              <span className="text-[#C8D8C4] break-all">{current.command}</span>
            </div>

            {/* Optional secondary command (desktop tab) */}
            {current.secondary && (
              <div className="flex items-start gap-2 mt-2">
                <span className="text-[#52B788] shrink-0">$</span>
                <span className="text-[#C8D8C4] break-all">{current.secondary}</span>
              </div>
            )}
          </div>
        </div>

        {/* Caption */}
        <p className={`font-[var(--font-outfit)] text-[0.85rem] text-[#8FAF8A] leading-relaxed mt-6 max-w-[600px] transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {current.caption}
        </p>

        {/* Platform support note */}
        <div className={`flex items-center gap-6 mt-4 text-[0.75rem] text-[#5A7A58] font-[var(--font-outfit)] transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span>✓ macOS arm64 (Apple Silicon)</span>
          <span>✓ Linux x64 (Ubuntu, Debian, CentOS)</span>
          <span className="text-[#3D5A3A]">○ Windows (coming soon)</span>
        </div>
      </div>
    </section>
  )
}
