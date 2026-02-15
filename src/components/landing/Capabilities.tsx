'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Bot, Network, RefreshCcw, SlidersHorizontal, Webhook, Code2 } from 'lucide-react'

const CAPABILITIES = [
  {
    icon: Bot,
    title: 'Agent-native',
    description: 'Speaks A2A. Drops into any agent ecosystem.',
    color: '#52B788',
  },
  {
    icon: Network,
    title: 'Swarm-ready',
    description: 'Deploy multiple instances as a collaborative mesh.',
    color: '#6FCF97',
  },
  {
    icon: RefreshCcw,
    title: 'Self-healing',
    description: 'Learns from feedback, fixes itself. No retraining.',
    color: '#8FAF8A',
  },
  {
    icon: SlidersHorizontal,
    title: 'Rules, not code',
    description: 'Fine-tune behavior with simple rules, not deploys.',
    color: '#52B788',
  },
  {
    icon: Webhook,
    title: 'APIs & MCPs',
    description: 'Turn approved queries into endpoints any system can call.',
    color: '#6FCF97',
  },
  {
    icon: Code2,
    title: 'Open source',
    description: 'Run it yourself. See every line of code.',
    color: '#8FAF8A',
  },
]

function CapabilityCard({
  cap,
  index,
  visible,
}: {
  cap: (typeof CAPABILITIES)[number]
  index: number
  visible: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    const maxTilt = 5
    const rotateX = -(mouseY / (rect.height / 2)) * maxTilt
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt
    setTilt({ x: rotateX, y: rotateY })

    const percentX = ((e.clientX - rect.left) / rect.width) * 100
    const percentY = ((e.clientY - rect.top) / rect.height) * 100
    setGlowPos({ x: percentX, y: percentY })
    setIsHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setIsHovering(false)
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-xl border border-[#52B788]/[0.06] bg-[#111916]/40 px-6 py-5 hover:border-[#52B788]/12 hover:bg-[#111916]/70 transition-all duration-700 gradient-border-card tilt-card ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-[0.95]'
      }`}
      style={{
        transitionDelay: `${index * 80}ms`,
        transform: visible
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1)`
          : 'translateY(16px) scale(0.95)',
      }}
    >
      {/* Inner glow that follows mouse */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(ellipse at ${glowPos.x}% ${glowPos.y}%, rgba(82, 183, 136, 0.08) 0%, transparent 60%)`,
        }}
      />

      <div className="flex items-start gap-4 relative z-[1]">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(82,183,136,0.25),0_0_32px_rgba(82,183,136,0.1)]"
          style={{
            background: `${cap.color}10`,
            border: `1px solid ${cap.color}18`,
          }}
        >
          <cap.icon
            size={17}
            style={{ color: cap.color }}
            className="opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:drop-shadow-[0_0_6px_rgba(82,183,136,0.5)]"
          />
        </div>
        <div>
          <h3 className="font-[var(--font-outfit)] text-[0.9rem] font-medium text-[#C8D8C4] mb-1">
            {cap.title}
          </h3>
          <p className="font-[var(--font-outfit)] text-[0.78rem] text-[#5A7A58] leading-relaxed">
            {cap.description}
          </p>
        </div>
      </div>
    </div>
  )
}

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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#52B788]/10 to-transparent" />

      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/50 mb-4 block">
            Capabilities
          </span>
          <h2 className="font-[var(--font-newsreader)] text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#C8D8C4] leading-tight">
            Built for the agentic era.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPABILITIES.map((cap, i) => (
            <CapabilityCard key={i} cap={cap} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}
