import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { Navigation } from '@/components/landing/Navigation'
import { Footer } from '@/components/landing/Footer'
import { ArrowRight, ArrowLeft, Clock, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Guides, workflows, and tips for using Baseil as your data agent. Data retrieval, database-to-MCP conversion, and data intelligence for AI agents.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — Baseil',
    description:
      'Guides, workflows, and tips for using Baseil as your data agent. Data retrieval, database-to-MCP conversion, and data intelligence for AI agents.',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#C8D8C4] overflow-x-hidden">
      <Navigation />

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #52B788 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #6FCF97 0%, transparent 70%)' }}
        />
      </div>

      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02] baseil-grain" />

      <div className="relative z-10 pt-28 pb-20">
        <div className="max-w-[860px] mx-auto px-6">
          {/* Back to home */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[0.78rem] font-[var(--font-outfit)] text-[#5A7A58] hover:text-[#52B788] transition-colors duration-300 mb-10 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-16">
            <span className="text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/50 mb-4 block">
              // Blog
            </span>
            <h1 className="font-[var(--font-newsreader)] text-[clamp(2rem,4vw,3rem)] text-[#C8D8C4] leading-tight mb-3">
              Learn Baseil
            </h1>
            <p className="font-[var(--font-outfit)] text-[0.95rem] text-[#5A7A58] max-w-[500px]">
              Guides, workflows, and tips for getting the most out of Baseil.
            </p>
          </div>

          {/* Post list */}
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-[var(--font-outfit)] text-[0.9rem] text-[#5A7A58]">
                No posts yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {posts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <article className="py-8 border-t border-[#52B788]/[0.06] group-hover:border-[#52B788]/15 transition-colors duration-500">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        {/* Tags */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {post.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#52B788]/[0.06] border border-[#52B788]/[0.08] text-[0.65rem] font-[var(--font-outfit)] text-[#52B788]/60 uppercase tracking-wider"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Title */}
                        <h2 className="font-[var(--font-newsreader)] text-[1.3rem] text-[#C8D8C4] group-hover:text-[#E0EAD8] transition-colors duration-300 mb-2 leading-snug">
                          {post.title}
                        </h2>

                        {/* Description */}
                        <p className="font-[var(--font-outfit)] text-[0.85rem] text-[#5A7A58] group-hover:text-[#8FAF8A] transition-colors duration-500 leading-relaxed line-clamp-2">
                          {post.description}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-4 mt-3 text-[0.72rem] font-[var(--font-outfit)] text-[#3D5A3A]">
                          <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          <span className="w-px h-3 bg-[#52B788]/15" />
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {post.readTime}
                          </span>
                          <span className="w-px h-3 bg-[#52B788]/15" />
                          <span>{post.author}</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="shrink-0 mt-8">
                        <ArrowRight
                          size={18}
                          className="text-[#3D5A3A] group-hover:text-[#52B788] group-hover:translate-x-1 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
              {/* Bottom border */}
              <div className="border-t border-[#52B788]/[0.06]" />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
