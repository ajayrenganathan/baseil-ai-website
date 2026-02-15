'use client'

import { Navigation } from '@/components/landing/Navigation'
import { Hero } from '@/components/landing/Hero'
import { Problem } from '@/components/landing/Problem'
import { VideoShowcase } from '@/components/landing/VideoShowcase'
import { Sandbox } from '@/components/landing/Sandbox'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Capabilities } from '@/components/landing/Capabilities'
import { Pricing } from '@/components/landing/Pricing'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="landing-page min-h-screen bg-[#0A0F0D] text-[#C8D8C4] overflow-x-hidden">
      <Navigation />
      <Hero />
      <HowItWorks />
      <Problem />
      <VideoShowcase />
      <Sandbox />
      <Capabilities />
      <Pricing />
      <Footer />
    </div>
  )
}
