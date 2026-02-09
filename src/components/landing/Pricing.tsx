'use client'

import { useRef, useState, useEffect } from 'react'
import { Check, Github, ArrowRight } from 'lucide-react'

const TIERS = [
  {
    name: 'Community',
    price: 'Free',
    subtitle: 'Self-host forever',
    features: [
      'Core baseil agent',
      'Schema auto-discovery',
      'Natural language queries',
      'Rules engine',
      'Limited connections',
      'Single instance',
    ],
    cta: { label: 'View on GitHub', icon: Github, href: '#' },
    highlight: false,
  },
  {
    name: 'Pro',
    price: 'Early Access',
    subtitle: 'Managed or self-hosted',
    features: [
      'Everything in Community',
      'Unlimited connections',
      'Swarm / mesh deployment',
      'API & MCP generation',
      'Priority support',
      'Advanced analytics',
    ],
    cta: { label: 'Request Access', icon: ArrowRight, href: '#early-access' },
    highlight: true,
  },
]

export function Pricing() {
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
    <section id="pricing" ref={sectionRef} className="relative py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#52B788]/10 to-transparent" />

      <div className="max-w-[800px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/50 mb-4 block">
            Open Source
          </span>
          <h2 className="font-[var(--font-newsreader)] text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#C8D8C4] leading-tight mb-3">
            Free to start. Open to inspect.
          </h2>
          <p className="font-[var(--font-outfit)] text-[0.9rem] text-[#5A7A58]">
            See the code, run it yourself, no vendor lock-in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TIERS.map((tier, i) => (
            <div
              key={i}
              className={`relative rounded-2xl border p-7 transition-all duration-700 ${
                tier.highlight
                  ? 'border-[#52B788]/15 bg-gradient-to-b from-[#52B788]/[0.04] to-[#111916]/60'
                  : 'border-[#52B788]/[0.06] bg-[#111916]/40'
              } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {tier.highlight && (
                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#52B788]/30 to-transparent" />
              )}

              <div className="mb-6">
                <h3 className="font-[var(--font-outfit)] text-[0.85rem] font-medium text-[#5A7A58] mb-1">{tier.name}</h3>
                <div className="font-[var(--font-newsreader)] text-[2rem] text-[#C8D8C4]">{tier.price}</div>
                <span className="font-[var(--font-outfit)] text-[0.75rem] text-[#3D5A3A]">{tier.subtitle}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-[0.82rem] font-[var(--font-outfit)] text-[#8FAF8A]">
                    <Check size={14} className={tier.highlight ? 'text-[#52B788]/70' : 'text-[#3D5A3A]'} />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={tier.cta.href}
                onClick={(e) => {
                  if (tier.cta.href === '#early-access') {
                    e.preventDefault()
                    document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-full text-[0.85rem] font-[var(--font-outfit)] font-medium transition-all duration-300 ${
                  tier.highlight
                    ? 'baseil-cta-primary'
                    : 'bg-[#52B788]/[0.04] border border-[#52B788]/10 text-[#5A7A58] hover:bg-[#52B788]/[0.08] hover:text-[#8FAF8A]'
                }`}
              >
                <tier.cta.icon size={15} />
                {tier.cta.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
