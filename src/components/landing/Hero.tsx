'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { User, Bot, ArrowRight } from 'lucide-react'
import { HeroShowcase } from './showcase/HeroShowcase'
import { BaseilMascot } from './BaseilMascot'
import { trackEvent } from '@/lib/analytics'

const FLOATING_SHAPES = [
  { size: 6, x: '12%', y: '20%', animation: 'shape-float-1', duration: '18s', delay: '0s', type: 'diamond' },
  { size: 4, x: '85%', y: '15%', animation: 'shape-float-2', duration: '22s', delay: '2s', type: 'circle' },
  { size: 5, x: '8%', y: '70%', animation: 'shape-float-3', duration: '20s', delay: '4s', type: 'diamond' },
  { size: 3, x: '92%', y: '55%', animation: 'shape-float-1', duration: '25s', delay: '1s', type: 'circle' },
  { size: 7, x: '75%', y: '80%', animation: 'shape-float-2', duration: '19s', delay: '3s', type: 'diamond' },
  { size: 4, x: '30%', y: '85%', animation: 'shape-float-3', duration: '23s', delay: '5s', type: 'circle' },
  { size: 5, x: '60%', y: '10%', animation: 'shape-float-1', duration: '21s', delay: '2.5s', type: 'diamond' },
]

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const glowRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => { setLoaded(true) }, [])

  // Mouse-tracking ambient light
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        if (glowRef.current && sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect()
          const x = mouseRef.current.x - rect.left
          const y = mouseRef.current.y - rect.top
          glowRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(82, 183, 136, 0.07), transparent 60%)`
        }
        rafRef.current = 0
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Aurora mesh background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute top-[10%] right-[10%] w-[700px] h-[700px] rounded-full blur-[120px] opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, #52B788 0%, transparent 70%)',
            animation: 'aurora-drift-1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-[30%] left-[5%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, #40916C 0%, transparent 70%)',
            animation: 'aurora-drift-2 25s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-[10%] left-[40%] w-[600px] h-[400px] rounded-full blur-[100px] opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, #6FCF97 0%, transparent 70%)',
            animation: 'aurora-drift-3 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-[-5%] left-[30%] w-[400px] h-[400px] rounded-full blur-[80px] opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, #52B788 0%, transparent 70%)',
            animation: 'aurora-drift-4 30s ease-in-out infinite',
          }}
        />
      </div>

      {/* Mouse-following ambient glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-1000"
        style={{ opacity: loaded ? 1 : 0 }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        {FLOATING_SHAPES.map((shape, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: shape.x,
              top: shape.y,
              width: shape.size,
              height: shape.size,
              animation: `${shape.animation} ${shape.duration} ease-in-out infinite`,
              animationDelay: shape.delay,
            }}
          >
            {shape.type === 'diamond' ? (
              <div
                className="w-full h-full rotate-45 border border-[#52B788]/20"
                style={{ background: 'rgba(82, 183, 136, 0.05)' }}
              />
            ) : (
              <div
                className="w-full h-full rounded-full border border-[#52B788]/15"
                style={{ background: 'rgba(82, 183, 136, 0.03)' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 z-[3] pointer-events-none opacity-[0.02] baseil-grain" />

      {/* Main content */}
      <div className="relative z-10 max-w-[900px] mx-auto px-6 w-full text-center pt-20 md:pt-24">
        {/* Mascot */}
        <div className={`mb-2 transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <BaseilMascot className="mx-auto" />
        </div>

        {/* Product name — big and bold like OpenClaw */}
        <h1
          className={`font-[var(--font-newsreader)] text-[clamp(3rem,8vw,5rem)] font-medium leading-[1] tracking-tight mb-3 gradient-text-animated glow-text transition-all duration-1000 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          Baseil
        </h1>

        {/* Tagline */}
        <p className={`font-[var(--font-outfit)] text-[clamp(0.7rem,1.5vw,0.85rem)] uppercase tracking-[0.25em] text-[#52B788] mb-6 transition-all duration-700 delay-[600ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Get all your data talking
        </p>

        {/* Description */}
        <p className={`font-[var(--font-outfit)] text-[0.9rem] leading-relaxed text-[#8FAF8A] max-w-[520px] mx-auto mb-5 transition-all duration-700 delay-[800ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          Baseil is an <span className="text-[#6FCF97]" style={{ textShadow: '0 0 12px rgba(82,183,136,0.15)' }}>AI data agent</span> that crawls into your databases, maps every schema, and serves up answers. No config, no connectors, no drama.
          <br className="hidden sm:block" />
          <span className="text-[#6FCF97]" style={{ textShadow: '0 0 12px rgba(82,183,136,0.15)' }}>One intelligent layer</span> where humans and AI agents ask in plain English and get answers instantly.
        </p>

        {/* Audience chips */}
        <div className={`flex items-center justify-center gap-2.5 mb-7 transition-all duration-700 delay-[950ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {[
            { icon: User, label: 'Humans' },
            { icon: Bot, label: 'Agents' },
          ].map((chip, i) => (
            <div
              key={chip.label}
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#52B788]/12 bg-[#52B788]/[0.04] hover:bg-[#52B788]/[0.08] hover:border-[#52B788]/20 transition-all duration-300 cursor-default"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <chip.icon size={13} className="text-[#52B788]/50 group-hover:text-[#52B788]/80 transition-colors duration-300" />
              <span className="text-[0.72rem] font-[var(--font-outfit)] text-[#8FAF8A] group-hover:text-[#C8D8C4] transition-colors duration-300">{chip.label}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className={`flex items-center justify-center gap-3 mb-10 transition-all duration-700 delay-[1100ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <a
            href="#early-access"
            onClick={(e) => { e.preventDefault(); trackEvent('cta_click', { button_label: 'join_waitlist', section: 'hero' }); document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="baseil-cta-primary text-[0.85rem] px-6 py-2.5 flex items-center gap-2"
          >
            Join the Waitlist
            <ArrowRight size={15} />
          </a>
          <a
            href="#sandbox"
            onClick={(e) => { e.preventDefault(); trackEvent('cta_click', { button_label: 'try_demo', section: 'hero' }); document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="baseil-cta-ghost text-[0.85rem] px-6 py-2.5"
          >
            Try the Demo
          </a>
        </div>

        {/* Animated showcase */}
        <div className={`-mx-6 px-0 text-left transition-all duration-1000 delay-[1300ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative">
            {/* Side label */}
            <div className="absolute -left-3 top-14 -translate-x-full hidden lg:flex items-center gap-3 origin-right">
              <span className="text-[0.72rem] font-[var(--font-outfit)] font-medium uppercase tracking-[0.2em] text-[#52B788] whitespace-nowrap px-4 py-1.5 rounded-full border border-[#52B788]/30 bg-[#52B788]/[0.06]" style={{ textShadow: '0 0 12px rgba(82,183,136,0.3)' }}>See it in action</span>
              <span className="w-10 h-[2px] bg-gradient-to-r from-[#52B788]/60 to-[#52B788]/10 rounded-full" />
            </div>
            <div
              className="absolute -inset-8 -z-10 rounded-3xl opacity-30"
              style={{
                background: 'radial-gradient(ellipse at 50% 50%, rgba(82,183,136,0.08) 0%, transparent 70%)',
                animation: 'showcase-orb-1 12s ease-in-out infinite',
              }}
            />
            {/* Rotating green border glow */}
            <div className="relative rounded-2xl p-[1.5px] overflow-hidden">
              <div
                className="absolute inset-[-50%] z-0"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, transparent 30%, rgba(82,183,136,0.5) 50%, transparent 70%, transparent 100%)',
                  animation: 'border-rotate 4s linear infinite',
                }}
              />
              <div className="relative z-[1] rounded-2xl overflow-hidden">
                <HeroShowcase />
              </div>
            </div>
          </div>
        </div>

        {/* Trust line */}
        <div className={`flex items-center justify-center flex-wrap gap-x-5 gap-y-2 mt-6 pb-10 text-[0.75rem] font-[var(--font-outfit)] text-[#8FAF8A] transition-all duration-700 delay-[1500ms] ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          {[
            { text: 'Use locally', note: null },
            { text: 'Agent Native', note: null },
            { text: 'Cloud', note: 'soon' },
            { text: 'Team Collaboration', note: 'soon' },
            { text: 'Self Host', note: 'soon' },
            { text: 'Swarm', note: 'soon' },
          ].map((item, i) => (
            <span key={item.text} className="flex items-center gap-5">
              {i > 0 && <span className="w-px h-3 bg-[#52B788]/20" />}
              <span className="hover:text-[#52B788] transition-colors duration-300 cursor-default">
                {item.text}{item.note && <span className="text-[#52B788]/40 ml-1">({item.note})</span>}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
