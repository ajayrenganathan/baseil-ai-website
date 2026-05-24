import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllDocs, getDocBySlug } from '@/lib/docs'
import { Navigation } from '@/components/landing/Navigation'
import { Footer } from '@/components/landing/Footer'
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { Clock, ChevronRight, Home } from 'lucide-react'

export function generateStaticParams() {
  const docs = getAllDocs()
  return docs.map(doc => ({ slug: doc.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const doc = getDocBySlug(slug)
  if (!doc) return {}
  return {
    title: `${doc.title} — Docs`,
    description: doc.description,
    alternates: { canonical: `/docs/${slug}` },
  }
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = getDocBySlug(slug)
  if (!doc) notFound()

  const allDocs = getAllDocs()
  const sidebarDocs = allDocs.map(d => ({ slug: d.slug, title: d.title, category: d.category }))

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#C8D8C4] overflow-x-hidden">
      <Navigation />

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[5%] right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #52B788 0%, transparent 70%)' }}
        />
      </div>
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02] baseil-grain" />

      <div className="relative z-10 pt-28 pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-[0.78rem] font-[var(--font-outfit)]">
            <Link href="/" className="text-[#5A7A58] hover:text-[#52B788] transition-colors duration-300 flex items-center gap-1">
              <Home size={12} />
              Home
            </Link>
            <ChevronRight size={12} className="text-[#3D5A3A]" />
            <Link href="/docs" className="text-[#5A7A58] hover:text-[#52B788] transition-colors duration-300">
              Docs
            </Link>
            <ChevronRight size={12} className="text-[#3D5A3A]" />
            <span className="text-[#8FAF8A] truncate max-w-[260px]">{doc.title}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-10">
            <DocsSidebar docs={sidebarDocs} />

            <article className="flex-1 min-w-0 max-w-[780px]">
              <header className="mb-10">
                <h1 className="font-[var(--font-newsreader)] text-[clamp(1.8rem,4vw,2.4rem)] text-[#C8D8C4] leading-tight mb-3">
                  {doc.title}
                </h1>
                {doc.description && (
                  <p className="font-[var(--font-outfit)] text-[1rem] text-[#8FAF8A] leading-relaxed mb-4">
                    {doc.description}
                  </p>
                )}
                <div className="flex items-center gap-3 pt-3 border-t border-[#52B788]/[0.06] text-[0.74rem] font-[var(--font-outfit)] text-[#5A7A58]">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {doc.readTime}
                  </span>
                </div>
              </header>

              <div className="blog-content">
                <MarkdownRenderer content={doc.content} />
              </div>
            </article>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
