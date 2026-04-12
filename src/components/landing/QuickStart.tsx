'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy, ChevronRight } from 'lucide-react'
import { ComingSoonBadge } from './ComingSoonBadge'

type InstallTab = 'one-liner' | 'desktop' | 'beta'
type Platform = 'unix' | 'windows'

interface TabContent {
  comment: string
  command: string
  caption: string
  secondary?: string
}

const TAB_CONTENT: Record<InstallTab, TabContent> = {
  'one-liner': {
    comment: '# One command. One agent. One layer for all your data.',
    command: 'curl -fsSL https://releases.baseil.ai/install.sh | sh',
    caption: 'Works on macOS and Linux. Installs the CLI and registers a local service so Baseil is ready when you are.',
  },
  'desktop': {
    comment: '# The desktop app wraps the CLI. Install the CLI first, then the app.',
    command: 'curl -fsSL https://releases.baseil.ai/install.sh | sh',
    secondary: 'open https://releases.baseil.ai/desktop/latest/baseil-arm64.dmg',
    caption: 'macOS arm64 today. Windows and Intel Mac are on the roadmap.',
  },
  'beta': {
    comment: '# Early access to the next release. New features land here first.',
    command: 'curl -fsSL https://releases.baseil.ai/install.sh | BASEIL_VERSION=beta sh',
    caption: 'Beta builds are stable enough for most people and ship weekly. Switch back to stable any time with the same installer.',
  },
}

export function QuickStart() {
  const [activeTab, setActiveTab] = useState<InstallTab>('one-liner')
  const [platform, setPlatform] = useState<Platform>('unix')
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

      <div className="relative max-w-[900px] mx-auto">
        {/* Section label */}
        <div className={`flex items-center gap-2 mb-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <ChevronRight size={16} className="text-[#52B788]" />
          <h2 className="font-[var(--font-outfit)] text-[0.78rem] uppercase tracking-[0.25em] text-[#52B788]">
            Quick Start
          </h2>
        </div>

        {/* Heading */}
        <p className={`font-[var(--font-newsreader)] text-[clamp(1.5rem,3vw,2.2rem)] text-[#C8D8C4] leading-tight mb-8 max-w-[620px] transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          From zero to talking-to-your-data in one command.
        </p>

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
              {(['one-liner', 'desktop', 'beta'] as const).map(tab => {
                const active = activeTab === tab
                const label = tab === 'one-liner' ? 'One-liner' : tab === 'desktop' ? 'Desktop' : 'Beta'
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

            {/* Platform tabs (right) */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => setPlatform('unix')}
                className={`px-3 py-1 rounded-md text-[0.72rem] font-[var(--font-outfit)] transition-colors duration-200 ${
                  platform === 'unix'
                    ? 'bg-[#52B788]/15 text-[#6FCF97] border border-[#52B788]/30'
                    : 'text-[#5A7A58] hover:text-[#8FAF8A] border border-transparent'
                }`}
              >
                macOS &amp; Linux
              </button>
              <button
                onClick={() => { /* windows soon */ }}
                disabled
                className="px-3 py-1 rounded-md text-[0.72rem] font-[var(--font-outfit)] text-[#3D5A3A] border border-transparent cursor-not-allowed inline-flex items-center gap-1.5"
                title="Coming soon"
              >
                Windows
                <ComingSoonBadge />
              </button>
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
      </div>
    </section>
  )
}
