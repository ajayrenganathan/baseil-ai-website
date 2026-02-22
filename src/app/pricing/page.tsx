import type { Metadata } from 'next'
import Link from 'next/link'
import { Navigation } from '@/components/landing/Navigation'
import { Pricing } from '@/components/landing/Pricing'
import { Footer } from '@/components/landing/Footer'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Baseil pricing — free data agent for data retrieval, database-to-MCP conversion, and data intelligence. Pro, Teams, and Enterprise plans for AI agents at scale.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing — Baseil',
    description:
      'Baseil pricing — free data agent for data retrieval, database-to-MCP conversion, and data intelligence. Pro, Teams, and Enterprise plans for AI agents at scale.',
  },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#C8D8C4] overflow-x-hidden">
      <Navigation />
      <div className="pt-28 pb-4 max-w-[1200px] mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[0.78rem] font-[var(--font-outfit)] text-[#5A7A58] hover:text-[#52B788] transition-colors duration-300 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Home
        </Link>
      </div>
      <Pricing />
      <Footer />
    </div>
  )
}
