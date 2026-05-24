import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllDocs } from '@/lib/docs'
import { Navigation } from '@/components/landing/Navigation'
import { Footer } from '@/components/landing/Footer'
import { ArrowRight, Book } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Baseil docs — install, connect databases, and get your first query running in minutes.',
  alternates: { canonical: '/docs' },
}

const categoryLabels: Record<string, string> = {
  'getting-started': 'Getting Started',
  'guides': 'Guides',
  'reference': 'Reference',
  'general': 'General',
}

export default function DocsListingPage() {
  const docs = getAllDocs()

  const grouped = docs.reduce<Record<string, typeof docs>>((acc, doc) => {
    const cat = doc.category || 'general'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(doc)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#C8D8C4] overflow-x-hidden">
      <Navigation />

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[10%] left-[30%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #52B788 0%, transparent 70%)' }}
        />
      </div>
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02] baseil-grain" />

      <div className="relative z-10 pt-28 pb-20">
        <div className="max-w-[900px] mx-auto px-6">
          <header className="mb-12">
            <p className="text-[0.72rem] font-[var(--font-outfit)] uppercase tracking-[0.25em] text-[#52B788] mb-3">
              // Documentation
            </p>
            <h1 className="font-[var(--font-newsreader)] text-[clamp(2rem,5vw,3rem)] text-[#C8D8C4] leading-tight mb-4">
              Get your first query running in minutes.
            </h1>
            <p className="font-[var(--font-outfit)] text-[1rem] text-[#8FAF8A] leading-relaxed max-w-[640px]">
              Install Baseil, connect a database, and ask it questions. Start with the quickstart below, or jump to the section you need.
            </p>
          </header>

          {docs.length === 0 ? (
            <div className="p-8 rounded-xl border border-[#52B788]/[0.08] bg-[#111916]/40 text-center">
              <Book size={32} className="mx-auto mb-3 text-[#52B788]/40" />
              <p className="font-[var(--font-outfit)] text-[0.95rem] text-[#8FAF8A]">
                Docs coming soon.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(grouped).map(([category, items]) => (
                <section key={category}>
                  <h2 className="font-[var(--font-outfit)] text-[0.78rem] uppercase tracking-[0.2em] text-[#52B788]/70 mb-4">
                    {categoryLabels[category] || category}
                  </h2>
                  <div className="grid gap-3">
                    {items.map(doc => (
                      <Link
                        key={doc.slug}
                        href={`/docs/${doc.slug}`}
                        className="group flex items-start gap-4 p-5 rounded-xl border border-[#52B788]/[0.08] bg-[#111916]/40 hover:bg-[#111916]/60 hover:border-[#52B788]/20 transition-all duration-300"
                      >
                        <div className="shrink-0 p-2 rounded-lg bg-[#52B788]/10 text-[#52B788] mt-0.5">
                          <Book size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-[var(--font-outfit)] text-[1rem] font-medium text-[#C8D8C4] group-hover:text-[#6FCF97] transition-colors duration-300 mb-1">
                            {doc.title}
                          </h3>
                          <p className="font-[var(--font-outfit)] text-[0.88rem] text-[#8FAF8A] leading-relaxed">
                            {doc.description}
                          </p>
                        </div>
                        <ArrowRight size={16} className="shrink-0 text-[#52B788]/40 group-hover:text-[#52B788] group-hover:translate-x-0.5 transition-all duration-300 mt-1" />
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
