'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/landing/Navigation'
import { Footer } from '@/components/landing/Footer'
import { ArrowRight, Users, Globe, Network, Sparkles } from 'lucide-react'

const FEATURES = [
  {
    icon: Users,
    title: 'Collaboration & Teams',
    description: 'Invite your team, share queries, build a shared knowledge base. Everyone sees the same data, speaks the same language.',
    detail: 'Role-based access, shared rules, team analytics.',
    emoji: '👥',
    color: '#52B788',
  },
  {
    icon: Globe,
    title: 'Sync & Use From Anywhere',
    description: 'Your Baseil instance follows you. Desktop, cloud, API — access your unified data layer from any device, any environment.',
    detail: 'Cross-device sync, cloud persistence, offline-first.',
    emoji: '🌍',
    color: '#6FCF97',
  },
  {
    icon: Network,
    title: 'Deploy as a Swarm',
    description: 'Spin up a mesh of Baseil agents across your infrastructure. They coordinate, distribute load, and invoke the full data mesh.',
    detail: 'Auto-discovery, load balancing, mesh topology.',
    emoji: '🐝',
    color: '#8FAF8A',
  },
]

function FeatureCard({
  feature,
  index,
  visible,
}: {
  feature: (typeof FEATURES)[number]
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
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 5
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 5
    setTilt({ x: rotateX, y: rotateY })
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
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
      className={`group relative rounded-2xl border border-[#52B788]/[0.06] bg-[#111916]/60 p-6 hover:border-[#52B788]/12 hover:bg-[#111916]/80 transition-all duration-700 gradient-border-card tilt-card ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{
        transitionDelay: `${index * 180}ms`,
        transform: visible
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          : 'translateY(32px)',
      }}
    >
      {/* Inner glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(ellipse at ${glowPos.x}% ${glowPos.y}%, rgba(82, 183, 136, 0.1) 0%, transparent 60%)`,
        }}
      />

      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110"
        style={{
          background: `${feature.color}10`,
          border: `1px solid ${feature.color}20`,
        }}
      >
        <feature.icon size={20} style={{ color: feature.color }} className="opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <h3 className="font-[var(--font-newsreader)] text-[1.35rem] text-[#C8D8C4] mb-2 relative z-[1]">
        <span className="mr-2">{feature.emoji}</span>{feature.title}
      </h3>
      <p className="font-[var(--font-outfit)] text-[0.88rem] text-[#8FAF8A] leading-relaxed relative z-[1] mb-3">
        {feature.description}
      </p>
      <p className="font-[var(--font-outfit)] text-[0.72rem] text-[#52B788]/50 relative z-[1]">
        {feature.detail}
      </p>
    </div>
  )
}

function CloudMascot({ visible }: { visible: boolean }) {
  return (
    <div className={`relative flex flex-col items-center transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Mascot */}
      <div className="relative z-10 mascot-float">
        <Image
          src="/robot/robot-front-left.png"
          alt="Baseil mascot"
          width={180}
          height={220}
          priority
          className="select-none pointer-events-none drop-shadow-[0_0_40px_rgba(82,183,136,0.2)]"
          style={{ objectFit: 'contain', height: 'auto' }}
        />
      </div>

      {/* Cloud underneath mascot — dense green-tinted puffs */}
      <div className="relative -mt-16 z-0 cloud-drift w-[400px] h-[120px]">
        {/* === CORE DENSE LAYER — solid center mass === */}
        {/* Core fill — dense center blob */}
        <div className="absolute rounded-full" style={{
          width: 280, height: 80,
          left: 60, top: 30,
          background: 'radial-gradient(ellipse at 50% 45%, rgba(120,195,150,0.65), rgba(82,183,136,0.25))',
          filter: 'blur(6px)',
        }} />
        {/* Second core layer for density */}
        <div className="absolute rounded-full" style={{
          width: 220, height: 65,
          left: 90, top: 32,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(145,215,175,0.6), rgba(100,185,145,0.2))',
          filter: 'blur(4px)',
        }} />
        {/* Third core — extra solidity */}
        <div className="absolute rounded-full" style={{
          width: 180, height: 50,
          left: 110, top: 36,
          background: 'radial-gradient(ellipse at 50% 42%, rgba(155,220,180,0.55), rgba(110,190,150,0.15))',
          filter: 'blur(3px)',
        }} />

        {/* === PUFF LAYER — visible bumps that move === */}
        {/* Left puff */}
        <div className="absolute rounded-full cloud-puff-2" style={{
          width: 130, height: 105,
          left: 20, top: 10,
          background: 'radial-gradient(ellipse at 45% 38%, rgba(115,200,155,0.58), rgba(82,183,136,0.12))',
          filter: 'blur(5px)',
        }} />
        {/* Center-left puff (tallest) */}
        <div className="absolute rounded-full cloud-puff-3" style={{
          width: 140, height: 115,
          left: 85, top: -8,
          background: 'radial-gradient(ellipse at 48% 35%, rgba(135,215,170,0.62), rgba(90,190,145,0.15))',
          filter: 'blur(4px)',
        }} />
        {/* Center puff — extra density */}
        <div className="absolute rounded-full cloud-puff-6" style={{
          width: 115, height: 100,
          left: 142, top: -4,
          background: 'radial-gradient(ellipse at 50% 36%, rgba(130,210,165,0.58), rgba(88,185,140,0.12))',
          filter: 'blur(4px)',
        }} />
        {/* Center-right puff */}
        <div className="absolute rounded-full cloud-puff-4" style={{
          width: 135, height: 110,
          left: 185, top: -2,
          background: 'radial-gradient(ellipse at 52% 36%, rgba(120,205,160,0.58), rgba(82,183,136,0.12))',
          filter: 'blur(4px)',
        }} />
        {/* Right puff */}
        <div className="absolute rounded-full cloud-puff-5" style={{
          width: 125, height: 98,
          left: 250, top: 10,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(110,195,152,0.52), rgba(82,183,136,0.1))',
          filter: 'blur(5px)',
        }} />

        {/* === EDGE WISPS — move the most === */}
        {/* Far-left wisp */}
        <div className="absolute rounded-full cloud-puff-7" style={{
          width: 95, height: 70,
          left: -8, top: 28,
          background: 'radial-gradient(ellipse at 50% 45%, rgba(105,190,148,0.4), rgba(82,183,136,0.06))',
          filter: 'blur(7px)',
        }} />
        {/* Far-right wisp */}
        <div className="absolute rounded-full cloud-puff-8" style={{
          width: 90, height: 65,
          left: 318, top: 30,
          background: 'radial-gradient(ellipse at 50% 45%, rgba(105,190,148,0.38), rgba(82,183,136,0.06))',
          filter: 'blur(7px)',
        }} />
        {/* Top-left wisp */}
        <div className="absolute rounded-full cloud-puff-9" style={{
          width: 75, height: 60,
          left: 50, top: -8,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(120,200,155,0.35), rgba(82,183,136,0.05))',
          filter: 'blur(6px)',
        }} />
        {/* Top-right wisp */}
        <div className="absolute rounded-full cloud-puff-10" style={{
          width: 70, height: 55,
          left: 272, top: -4,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(120,200,155,0.32), rgba(82,183,136,0.05))',
          filter: 'blur(6px)',
        }} />

        {/* === BASE WIDE LAYER — anchors the bottom === */}
        <div className="absolute rounded-full cloud-puff-1" style={{
          width: 340, height: 60,
          left: 30, top: 52,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(100,185,145,0.5), rgba(82,183,136,0.1))',
          filter: 'blur(6px)',
        }} />

        {/* === HIGHLIGHT — bright top edge === */}
        <div className="absolute rounded-full cloud-puff-6" style={{
          width: 200, height: 45,
          left: 100, top: 2,
          background: 'radial-gradient(ellipse at 50% 30%, rgba(165,230,190,0.4), transparent)',
          filter: 'blur(3px)',
        }} />

        {/* Green glow underneath */}
        <div
          className="absolute pointer-events-none cloud-glow-breathe"
          style={{
            width: 320, height: 55,
            left: 40, top: 55,
            background: 'radial-gradient(ellipse, rgba(82,183,136,0.22) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
      </div>
    </div>
  )
}

export default function PlatformPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [featuresVisible, setFeaturesVisible] = useState(false)

  useEffect(() => { setHeroVisible(true) }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFeaturesVisible(true) },
      { threshold: 0.15 }
    )
    if (featuresRef.current) observer.observe(featuresRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#C8D8C4] overflow-x-hidden">
      <Navigation />

      {/* Aurora background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[5%] right-[15%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, #52B788 0%, transparent 70%)',
            animation: 'aurora-drift-1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-[40%] left-[10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, #40916C 0%, transparent 70%)',
            animation: 'aurora-drift-2 25s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-[10%] right-[30%] w-[500px] h-[350px] rounded-full blur-[100px] opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, #6FCF97 0%, transparent 70%)',
            animation: 'aurora-drift-3 18s ease-in-out infinite',
          }}
        />
      </div>

      {/* Grain */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02] baseil-grain" />

      {/* Hero */}
      <section ref={heroRef} className="relative z-10 pt-32 pb-16">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          {/* Coming Soon badge */}
          <div className={`mb-8 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#52B788]/20 bg-[#52B788]/[0.05] text-[0.72rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]">
              <Sparkles size={12} className="animate-pulse" />
              Coming Soon
            </span>
          </div>

          {/* Mascot on cloud */}
          <CloudMascot visible={heroVisible} />

          {/* Title */}
          <h1
            className={`font-[var(--font-newsreader)] text-[clamp(2.2rem,5vw,3.5rem)] font-medium leading-[1.1] tracking-tight mb-4 gradient-text-animated glow-text transition-all duration-1000 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            The Baseil Platform
          </h1>

          <p className={`font-[var(--font-outfit)] text-[0.95rem] leading-relaxed text-[#8FAF8A] max-w-[560px] mx-auto mb-8 transition-all duration-700 delay-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Everything you need to scale Baseil across your organization.
            <br />
            <span className="text-[#6FCF97]" style={{ textShadow: '0 0 12px rgba(82,183,136,0.15)' }}>
              Teams, cloud sync, and swarm deployment
            </span> — all in one place.
          </p>

          {/* CTA */}
          <div className={`flex items-center justify-center gap-3 mb-10 transition-all duration-700 delay-900 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              href="/#early-access"
              className="baseil-cta-primary text-[0.85rem] px-6 py-2.5 flex items-center gap-2"
            >
              Join the Waitlist
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/"
              className="baseil-cta-ghost text-[0.85rem] px-6 py-2.5"
            >
              Back to Home
            </Link>
          </div>

          {/* Scroll down indicator */}
          <div className={`flex flex-col items-center gap-2 transition-all duration-700 delay-[1100ms] ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="font-[var(--font-outfit)] text-[0.75rem] text-[#5A7A58] tracking-wide">
              Scroll down for more details
            </p>
            <button
              onClick={() => document.getElementById('platform-features')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex flex-col items-center gap-1 cursor-pointer"
            >
              <div className="w-[1px] h-6 bg-gradient-to-b from-[#52B788]/30 to-[#52B788]/5 group-hover:from-[#52B788]/50 transition-colors duration-300" />
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-[#52B788]/40 group-hover:text-[#52B788]/70 transition-colors duration-300 animate-bounce" style={{ animationDuration: '2s' }}>
                <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="platform-features" ref={featuresRef} className="relative z-10 py-14">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-10">
            <span className={`text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/50 mb-4 block transition-all duration-700 ${featuresVisible ? 'opacity-100' : 'opacity-0'}`}>
              // Platform Features
            </span>
            <h2 className={`font-[var(--font-newsreader)] text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#C8D8C4] leading-tight transition-all duration-700 delay-150 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Built for scale. Designed for teams.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} visible={featuresVisible} />
            ))}
          </div>

          {/* Data Mesh callout */}
          <div className={`mt-8 transition-all duration-700 delay-700 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="relative rounded-2xl border border-[#52B788]/[0.08] bg-[#111916]/40 p-6 max-w-[750px] mx-auto text-center hover:border-[#52B788]/15 hover:bg-[#111916]/70 transition-all duration-500">
              <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#52B788]/30 to-transparent" />
              <h3 className="font-[var(--font-newsreader)] text-[1.3rem] text-[#C8D8C4] mb-2">
                Invoke the Data Mesh
              </h3>
              <p className="font-[var(--font-outfit)] text-[0.88rem] text-[#8FAF8A] leading-relaxed max-w-[520px] mx-auto mb-4">
                When you deploy Baseil as a swarm, each node discovers its local databases and shares metadata across the mesh. The result? A <span className="text-[#6FCF97]" style={{ textShadow: '0 0 12px rgba(82,183,136,0.15)' }}>self-organizing data fabric</span> that spans your entire infrastructure.
              </p>
              <div className="flex items-center justify-center gap-4 text-[0.72rem] font-[var(--font-outfit)] text-[#5A7A58]">
                {['Auto-discovery', 'Zero config', 'Infinite scale'].map((tag, i) => (
                  <span key={tag} className="flex items-center gap-3">
                    {i > 0 && <span className="w-px h-3 bg-[#52B788]/20" />}
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="relative z-10 py-20">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <p className="font-[var(--font-outfit)] text-[0.85rem] text-[#5A7A58] italic mb-3">
            We&apos;re building this right now.
          </p>
          <p className="baseil-text-shimmer font-[var(--font-newsreader)] text-[1.2rem] italic mb-8">
            The platform is coming. The swarm is inevitable.
          </p>
          <Link
            href="/#early-access"
            className="baseil-cta-primary cta-glow-pulse text-[0.9rem] px-8 py-3 inline-flex items-center gap-2"
          >
            Get on the Waitlist
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
