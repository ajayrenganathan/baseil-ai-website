'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Check, ArrowRight } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

const TIERS = [
  // {
  //   name: 'Basic',
  //   price: 'Free',
  //   subtitle: 'Get started locally',
  //   features: [
  //     'Core baseil agent',
  //     'Schema auto-discovery',
  //     'Natural language queries',
  //     'Rules engine',
  //     'Limited connections',
  //   ],
  //   cta: { label: 'Get Started', icon: ArrowRight, href: '#' },
  //   highlight: false,
  // },
  {
    name: 'Pro',
    price: 'Free',
    subtitle: 'Free during beta',
    features: [
      'Everything in Basic',
      'Unlimited connections',
      'API & MCP generation',
      'Priority support',
    ],
    cta: { label: 'Join the Waitlist', icon: ArrowRight, href: '#early-access' },
    highlight: true,
  },
  {
    name: 'Teams',
    price: 'Waitlist',
    subtitle: 'Build your intelligence layer together',
    features: [
      'Everything in Pro',
      'Cloud sync',
      'Team collaboration',
      'Shared dashboards',
    ],
    cta: { label: 'Coming Soon', icon: ArrowRight, href: '#early-access' },
    highlight: false,
  },
  {
    name: 'Enterprise',
    price: 'Waitlist',
    subtitle: 'Full control at scale',
    features: [
      'Everything in Teams',
      'Swarm / mesh deployment',
      'Root server',
      'Self-hosted deployment',
      'Custom SLAs',
    ],
    cta: { label: 'Contact Us', icon: ArrowRight, href: '#early-access' },
    highlight: false,
  },
]

function PricingCard({
  tier,
  index,
  visible,
}: {
  tier: (typeof TIERS)[number]
  index: number
  visible: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    const maxTilt = 2
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt
    const rotateX = -(mouseY / (rect.height / 2)) * maxTilt
    setTilt({ x: rotateY, y: rotateX })

    const glowX = ((e.clientX - rect.left) / rect.width) * 100
    const glowY = ((e.clientY - rect.top) / rect.height) * 100
    setGlowPos({ x: glowX, y: glowY })
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-700 ${
        tier.highlight
          ? 'gradient-border-card border-[#52B788]/15 bg-gradient-to-b from-[#52B788]/[0.04] to-[#111916]/60'
          : 'border-[#52B788]/[0.06] bg-[#111916]/40'
      } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{
        transitionDelay: `${index * 150}ms`,
        transform: visible
          ? `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
          : 'translateY(24px)',
        willChange: 'transform',
        transitionProperty: 'opacity, transform',
        transitionTimingFunction: isHovered ? 'ease-out' : 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDuration: isHovered ? '0.15s' : '0.7s',
      }}
    >
      {/* Inner glow following mouse */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at ${glowPos.x}% ${glowPos.y}%, rgba(82, 183, 136, 0.1) 0%, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {tier.highlight && (
        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#52B788]/30 to-transparent" />
      )}

      <div className="relative z-10 mb-6">
        <h3 className="font-[var(--font-newsreader)] text-[1.4rem] text-[#C8D8C4] mb-2">{tier.name}</h3>
        {tier.price === 'Free' ? (
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-[var(--font-newsreader)] text-[2rem] text-[#C8D8C4] leading-none">Free</span>
          </div>
        ) : (
          <div className="mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#52B788]/15 bg-[#52B788]/[0.06] text-[0.75rem] font-[var(--font-outfit)] text-[#52B788]/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]/50 animate-pulse" />
              Waitlist
            </span>
          </div>
        )}
        <span className="font-[var(--font-outfit)] text-[0.75rem] text-[#3D5A3A]">{tier.subtitle}</span>
      </div>

      <ul className="relative z-10 space-y-3 mb-8 flex-1">
        {tier.features.map((feature, j) => (
          <li
            key={j}
            className={`flex items-center gap-3 text-[0.82rem] font-[var(--font-outfit)] text-[#8FAF8A] transition-all duration-500 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
            }`}
            style={{
              transitionDelay: visible ? `${index * 150 + 300 + j * 80}ms` : '0ms',
            }}
          >
            <Check size={14} className={tier.highlight ? 'text-[#52B788]/70' : 'text-[#3D5A3A]'} />
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={tier.cta.href}
        onClick={(e) => {
          const labelMap: Record<string, string> = {
            'Join the Waitlist': 'join_waitlist',
            'Contact Us': 'contact_us',
            'Coming Soon': 'coming_soon',
          }
          const sectionMap: Record<string, string> = {
            'Pro': 'pricing_pro',
            'Teams': 'pricing_teams',
            'Enterprise': 'pricing_enterprise',
          }
          trackEvent('cta_click', {
            button_label: labelMap[tier.cta.label] || tier.cta.label.toLowerCase().replace(/\s+/g, '_'),
            section: sectionMap[tier.name] || `pricing_${tier.name.toLowerCase()}`,
          })
          if (tier.cta.href === '#early-access') {
            e.preventDefault()
            document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' })
          }
        }}
        className={`relative z-10 flex items-center justify-center gap-2 w-full py-3 rounded-full text-[0.85rem] font-[var(--font-outfit)] font-medium transition-all duration-300 ${
          tier.highlight
            ? 'baseil-cta-primary cta-glow-pulse'
            : 'bg-[#52B788]/[0.04] border border-[#52B788]/10 text-[#5A7A58] hover:bg-[#52B788]/[0.08] hover:text-[#8FAF8A]'
        }`}
      >
        <tier.cta.icon size={15} />
        {tier.cta.label}
      </a>
    </div>
  )
}

export function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          trackEvent('section_view', { section_name: 'pricing' })
        }
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="pricing" ref={sectionRef} className="relative py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#52B788]/10 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/50 mb-4 block">
            Pricing
          </span>
          <h1 className="font-[var(--font-newsreader)] text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#C8D8C4] leading-tight mb-3">
            One agent. Three ways to run it.
          </h1>
          <p className="font-[var(--font-outfit)] text-[0.9rem] text-[#5A7A58]">
            Self-host for free, or let us manage it for your team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map((tier, i) => (
            <PricingCard key={i} tier={tier} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}
