'use client'

import { useRef, useState, useEffect } from 'react'
import { MessageSquare, Compass, GitMerge, Wrench, Sparkles } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Natural language in, structured data out',
    description: 'Ask a question in plain English. Baseil figures out which databases to hit, writes the queries, and returns clean structured results.',
    accent: '#52B788',
  },
  {
    icon: Compass,
    title: 'Auto-onboarding',
    description: 'Just add your connection string. Baseil crawls your schemas, discovers relationships, and maps join paths — all on its own.',
    accent: '#6FCF97',
  },
  {
    icon: GitMerge,
    title: 'Cross-database joins',
    description: 'Data in Postgres and MySQL? Baseil joins across databases seamlessly. You ask, it figures out the path.',
    accent: '#8FAF8A',
  },
  {
    icon: Wrench,
    title: 'Database to MCP, automatically',
    description: 'Every connected data store is automatically exposed as MCP tools. Your AI agents can query any database without custom integrations.',
    accent: '#52B788',
  },
  {
    icon: Sparkles,
    title: 'Rules & golden cache',
    description: 'Add rules to shape how Baseil responds. Pin golden queries to cache for instant results. Your data, your way, at speed.',
    accent: '#6FCF97',
  },
]

export function Capabilities() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (!hasTrackedRef.current) {
            trackEvent('section_view', { section_name: 'capabilities' })
            hasTrackedRef.current = true
          }
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="capabilities" ref={sectionRef} className="relative py-16 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#52B788]/10 to-transparent" />

      <div className="max-w-[1100px] mx-auto px-6">
        <div className="mb-10">
          <span className="text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/50 mb-4 block">
            // Capabilities
          </span>
          <h2 className="font-[var(--font-newsreader)] text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#C8D8C4] leading-tight max-w-[500px]">
            Data retrieval, built for AI agents.
          </h2>
        </div>

        {/* Feature rows */}
        <div className="space-y-0">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className={`group transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1.2fr] gap-6 md:gap-10 items-start py-5 border-t border-[#52B788]/[0.06] group-hover:border-[#52B788]/15 transition-colors duration-500">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: `${feature.accent}10`,
                    border: `1px solid ${feature.accent}18`,
                  }}
                >
                  <feature.icon
                    size={18}
                    style={{ color: feature.accent }}
                    className="opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(82,183,136,0.4)]"
                  />
                </div>

                {/* Title */}
                <h3 className="font-[var(--font-newsreader)] text-[1.15rem] text-[#C8D8C4] group-hover:text-[#E0EAD8] transition-colors duration-300 leading-snug md:pt-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="font-[var(--font-outfit)] text-[0.85rem] text-[#5A7A58] group-hover:text-[#8FAF8A] leading-relaxed transition-colors duration-500 md:pt-2">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
          {/* Bottom border for last item */}
          <div className="border-t border-[#52B788]/[0.06]" />
        </div>
      </div>
    </section>
  )
}
