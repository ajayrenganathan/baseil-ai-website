'use client'

import { HeroShowcase } from '@/components/landing/showcase/HeroShowcase'

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-[#0A0F0D] flex items-center justify-center p-8">
      <div className="max-w-[900px] w-full">
        <HeroShowcase />
      </div>
    </div>
  )
}
