'use client'

import { Navigation } from '@/components/landing/Navigation'
import { Hero } from '@/components/landing/Hero'
import { Problem } from '@/components/landing/Problem'
import { Sandbox } from '@/components/landing/Sandbox'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Capabilities } from '@/components/landing/Capabilities'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="landing-page min-h-screen bg-[#0A0F0D] text-[#C8D8C4] overflow-x-hidden">
      <Navigation />
      <Hero />
      <HowItWorks />
      <Capabilities />
      <Problem />
      <Sandbox />
      <Footer />
    </div>
  )
}
