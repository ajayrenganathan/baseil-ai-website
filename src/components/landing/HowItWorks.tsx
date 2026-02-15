'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Plug, Radar, Globe, MessageSquareHeart } from 'lucide-react'

const STEPS = [
  {
    icon: Plug,
    title: 'Connect',
    description: 'Point Baseil at your database and watch it shake hands.',
    note: 'Currently supports PostgreSQL — more coming soon.',
    emoji: '🔌',
    color: '#52B788',
  },
  {
    icon: Radar,
    title: 'Discover',
    description: 'Baseil maps every table, column, and relationship on its own. You do nothing.',
    note: null,
    emoji: '🧠',
    color: '#6FCF97',
  },
  {
    icon: Globe,
    title: 'Serve',
    description: 'Natural language, APIs, MCPs — humans, agents, and apps all get answers instantly.',
    note: null,
    emoji: '⚡',
    color: '#8FAF8A',
  },
]

function StepCard({
  step,
  index,
  visible,
}: {
  step: (typeof STEPS)[number]
  index: number
  visible: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)
  const [displayNum, setDisplayNum] = useState('00')
  const hasAnimated = useRef(false)

  // Step number counter animation
  useEffect(() => {
    if (visible && !hasAnimated.current) {
      hasAnimated.current = true
      const target = index + 1
      const duration = 600
      const steps = 8
      const interval = duration / steps
      let count = 0
      const timer = setInterval(() => {
        count++
        if (count >= steps) {
          setDisplayNum(String(target).padStart(2, '0'))
          clearInterval(timer)
        } else {
          // Show random digits before settling
          const rand = Math.floor(Math.random() * 10)
          setDisplayNum(String(rand).padStart(2, '0'))
        }
      }, interval)
      return () => clearInterval(timer)
    }
  }, [visible, index])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    const maxTilt = 6
    const rotateX = -(mouseY / (rect.height / 2)) * maxTilt
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt
    setTilt({ x: rotateX, y: rotateY })

    // Inner glow follows cursor
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
      className={`group relative rounded-2xl border border-[#52B788]/[0.06] bg-[#111916]/60 p-8 hover:border-[#52B788]/12 hover:bg-[#111916]/80 transition-all duration-700 gradient-border-card tilt-card ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{
        transitionDelay: `${index * 150}ms`,
        transform: visible
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          : 'translateY(24px)',
      }}
    >
      {/* Inner glow that follows mouse */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(ellipse at ${glowPos.x}% ${glowPos.y}%, rgba(82, 183, 136, 0.1) 0%, transparent 60%)`,
        }}
      />

      <span
        className="text-[0.65rem] font-[var(--font-outfit)] text-[#3D5A3A] absolute top-4 right-4 transition-all duration-300 font-mono tabular-nums"
        style={{
          textShadow: visible ? '0 0 8px rgba(82, 183, 136, 0.3)' : 'none',
        }}
      >
        {displayNum}
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

      <h3 className="font-[var(--font-newsreader)] text-[1.3rem] text-[#C8D8C4] mb-2 relative z-[1]">
        <span className="mr-2">{step.emoji}</span>{step.title}
      </h3>
      <p className="font-[var(--font-outfit)] text-[0.85rem] text-[#8FAF8A] leading-relaxed relative z-[1]">
        {step.description}
      </p>
      {step.note && (
        <p className="font-[var(--font-outfit)] text-[0.7rem] text-[#52B788]/50 mt-2 relative z-[1]">
          {step.note}
        </p>
      )}
    </div>
  )
}

function ConnectingDots() {
  return (
    <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none" aria-hidden="true">
      <svg
        className="absolute top-1/2 left-0 w-full"
        style={{ transform: 'translateY(-50%)' }}
        height="40"
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Dotted line from step 1 to step 2 */}
        <line
          x1="200"
          y1="20"
          x2="470"
          y2="20"
          stroke="rgba(82,183,136,0.15)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        {/* Dotted line from step 2 to step 3 */}
        <line
          x1="530"
          y1="20"
          x2="800"
          y2="20"
          stroke="rgba(82,183,136,0.15)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        {/* Animated dot 1 -> 2 */}
        <circle r="3" fill="#52B788" opacity="0.7">
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            path="M200,20 L470,20"
          />
          <animate
            attributeName="opacity"
            values="0;0.8;0.8;0"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="3" fill="#52B788" opacity="0.7">
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            path="M200,20 L470,20"
            begin="1.5s"
          />
          <animate
            attributeName="opacity"
            values="0;0.8;0.8;0"
            dur="3s"
            repeatCount="indefinite"
            begin="1.5s"
          />
        </circle>
        {/* Animated dot 2 -> 3 */}
        <circle r="3" fill="#6FCF97" opacity="0.7">
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            path="M530,20 L800,20"
            begin="0.5s"
          />
          <animate
            attributeName="opacity"
            values="0;0.8;0.8;0"
            dur="3s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </circle>
        <circle r="3" fill="#6FCF97" opacity="0.7">
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            path="M530,20 L800,20"
            begin="2s"
          />
          <animate
            attributeName="opacity"
            values="0;0.8;0.8;0"
            dur="3s"
            repeatCount="indefinite"
            begin="2s"
          />
        </circle>
      </svg>
    </div>
  )
}

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
    <section id="how-it-works" ref={sectionRef} className="relative pt-16 pb-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#52B788]/10 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/50 mb-4 block">
            // How it works
          </span>
          <h2 className="font-[var(--font-newsreader)] text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#C8D8C4] leading-tight">
            Three steps. Zero headaches.
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          <ConnectingDots />
          {STEPS.map((step, i) => (
            <StepCard key={i} step={step} index={i} visible={visible} />
          ))}
        </div>

        {/* Feedback loop */}
        <div className={`mt-12 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="group relative rounded-2xl border border-[#52B788]/[0.08] bg-[#111916]/40 p-7 hover:border-[#52B788]/15 hover:bg-[#111916]/70 transition-all duration-500 flex items-start gap-5 max-w-[700px] mx-auto">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[#52B788]/[0.08] border border-[#52B788]/[0.12] group-hover:scale-110 transition-transform duration-500">
              <MessageSquareHeart size={18} className="text-[#52B788] opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h4 className="font-[var(--font-newsreader)] text-[1.1rem] text-[#C8D8C4] mb-1">Teach it with feedback</h4>
              <p className="font-[var(--font-outfit)] text-[0.8rem] text-[#8FAF8A] leading-relaxed">
                Thumbs up, thumbs down, or add rules. Baseil speeds up queries and customises responses based on your feedback — learning how your team actually talks about your data.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="font-[var(--font-outfit)] text-[0.85rem] text-[#5A7A58] italic">
            ...and it keeps getting smarter with every query. <span className="text-[#6FCF97]" style={{ textShadow: '0 0 12px rgba(82,183,136,0.15)' }}>It never sleeps.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
