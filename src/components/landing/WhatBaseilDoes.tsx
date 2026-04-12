'use client'

import { useEffect, useRef, useState } from 'react'
import { Plug, Brain, MessageSquare, Layers, Network, Wand2 } from 'lucide-react'
import { ComingSoonBadge } from './ComingSoonBadge'

interface Feature {
  icon: typeof Plug
  title: string
  description: string
  comingSoon?: boolean
}

const FEATURES: Feature[] = [
  {
    icon: Plug,
    title: 'Expose data as MCP tools',
    description: 'Point Baseil at a database and it generates Model Context Protocol tools automatically. No extra code, no tool definitions to maintain.',
  },
  {
    icon: Brain,
    title: 'Intelligent data retrieval',
    description: 'Schema-aware retrieval across every database you connect. Baseil picks the right tool, writes the right query, and returns structured results.',
  },
  {
    icon: MessageSquare,
    title: 'No-code data analysis',
    description: 'Ask in plain English. Get structured answers back. No SQL, no BI tool learning curve, no middleman.',
  },
  {
    icon: Layers,
    title: 'One layer for humans and agents',
    description: 'Connect once. Serve everyone. Same intelligent layer answers chat questions, powers API calls, and feeds data to AI agents.',
  },
  {
    icon: Network,
    title: 'Expose your agent via A2A',
    description: 'Make Baseil discoverable to other agents through the Agent-to-Agent protocol. Compose specialized data agents into a mesh.',
    comingSoon: true,
  },
  {
    icon: Wand2,
    title: 'Customizable skills',
    description: 'Build and tune skills that optimize how your data gets accessed by agents. Encode business logic, shape retrieval patterns, pin workflows.',
    comingSoon: true,
  },
]

export function WhatBaseilDoes() {
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

  return (
    <section
      ref={sectionRef}
      id="what-baseil-does"
      className="relative py-24 px-6"
    >
      {/* Subtle aurora */}
      <div
        className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #52B788 0%, transparent 70%)' }}
      />

      <div className="relative max-w-[1100px] mx-auto">
        {/* Section label */}
        <p className={`font-[var(--font-outfit)] text-[0.72rem] uppercase tracking-[0.25em] text-[#52B788] mb-3 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          // What Baseil Does
        </p>

        {/* Heading */}
        <h2 className={`font-[var(--font-newsreader)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-medium leading-[1.1] tracking-tight mb-4 max-w-[720px] transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          The data harness your AI stack has been missing.
        </h2>

        {/* Subheading */}
        <p className={`font-[var(--font-outfit)] text-[0.95rem] leading-relaxed text-[#8FAF8A] max-w-[640px] mb-12 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Baseil is the intelligent layer between your data and everything that wants to use it. Humans asking questions, AI agents pulling context, apps making API calls. One connection, every interface.
        </p>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`group relative p-6 rounded-xl border border-[#52B788]/10 bg-[#111916]/40 hover:bg-[#111916]/60 hover:border-[#52B788]/25 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${300 + i * 80}ms` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 p-2 rounded-lg bg-[#52B788]/10 text-[#52B788]">
                  <feature.icon size={18} />
                </div>
                <div className="flex-1 flex items-center gap-2 flex-wrap pt-1">
                  <h3 className="font-[var(--font-outfit)] text-[0.95rem] font-medium text-[#C8D8C4]">
                    {feature.title}
                  </h3>
                  {feature.comingSoon && <ComingSoonBadge />}
                </div>
              </div>
              <p className="font-[var(--font-outfit)] text-[0.85rem] leading-relaxed text-[#8FAF8A]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
