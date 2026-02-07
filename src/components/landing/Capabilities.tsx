'use client'

import { useRef, useState, useEffect } from 'react'
import { Bot, Network, RefreshCcw, SlidersHorizontal, Webhook, Code2 } from 'lucide-react'

const CAPABILITIES = [
  {
    icon: Bot,
    title: 'Agent-native',
    description: 'Speaks A2A. Drops into any agent ecosystem.',
    color: '#3b82f6',
  },
  {
    icon: Network,
    title: 'Swarm-ready',
    description: 'Deploy multiple instances as a collaborative mesh.',
    color: '#0ee6d4',
  },
  {
    icon: RefreshCcw,
    title: 'Self-healing',
    description: 'Learns from feedback, fixes itself. No retraining.',
    color: '#a78bfa',
  },
  {
    icon: SlidersHorizontal,
    title: 'Rules, not code',
    description: 'Fine-tune behavior with simple rules, not deploys.',
    color: '#f59e0b',
  },
  {
    icon: Webhook,
    title: 'APIs & MCPs',
    description: 'Turn approved queries into endpoints any system can call.',
    color: '#ec4899',
  },
  {
    icon: Code2,
    title: 'Open source',
    description: 'Run it yourself. See every line of code.',
    color: '#10b981',
  },
]

export function Capabilities() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="capabilities" ref={sectionRef} className="relative py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[0.7rem] font-[var(--font-dm-sans)] uppercase tracking-[0.2em] text-[#0ee6d4]/60 mb-4 block">
            Capabilities
          </span>
          <h2 className="font-[var(--font-instrument-serif)] text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#e8e6e3] leading-tight">
            Built for the agentic era.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPABILITIES.map((cap, i) => (
            <div
              key={i}
              className={`group relative rounded-xl border border-white/[0.04] bg-white/[0.01] px-6 py-5 hover:border-white/[0.08] hover:bg-white/[0.02] transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: `${cap.color}08`,
                    border: `1px solid ${cap.color}12`,
                  }}
                >
                  <cap.icon size={17} style={{ color: cap.color }} className="opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div>
                  <h3 className="font-[var(--font-dm-sans)] text-[0.9rem] font-medium text-[#d0d0e0] mb-1">
                    {cap.title}
                  </h3>
                  <p className="font-[var(--font-dm-sans)] text-[0.78rem] text-[#5a5a6a] leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
