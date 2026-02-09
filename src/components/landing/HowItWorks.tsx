'use client'

import { useRef, useState, useEffect } from 'react'
import { Plug, Radar, Globe } from 'lucide-react'

const STEPS = [
  {
    icon: Plug,
    title: 'Connect',
    description: 'Any database, any schema. Seconds.',
    color: '#52B788',
  },
  {
    icon: Radar,
    title: 'Discover',
    description: 'Autonomous schema exploration. Zero config.',
    color: '#6FCF97',
  },
  {
    icon: Globe,
    title: 'Serve',
    description: 'Natural language, APIs, MCPs. Humans, agents, apps.',
    color: '#8FAF8A',
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#52B788]/10 to-transparent" />

      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/50 mb-4 block">
            How it works
          </span>
          <h2 className="font-[var(--font-newsreader)] text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#C8D8C4] leading-tight">
            Three steps. That&apos;s it.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl border border-[#52B788]/[0.06] bg-[#111916]/60 p-8 hover:border-[#52B788]/12 hover:bg-[#111916]/80 transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <span className="text-[0.65rem] font-[var(--font-outfit)] text-[#3D5A3A] absolute top-4 right-4">
                0{i + 1}
              </span>

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110"
                style={{
                  background: `${step.color}10`,
                  border: `1px solid ${step.color}20`,
                }}
              >
                <step.icon size={22} style={{ color: step.color }} className="opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <h3 className="font-[var(--font-newsreader)] text-[1.3rem] text-[#C8D8C4] mb-2">
                {step.title}
              </h3>
              <p className="font-[var(--font-outfit)] text-[0.85rem] text-[#5A7A58] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="font-[var(--font-outfit)] text-[0.85rem] text-[#3D5A3A] italic">
            ...and it keeps getting smarter. Every query, every piece of feedback, every rule.
          </p>
        </div>
      </div>
    </section>
  )
}
