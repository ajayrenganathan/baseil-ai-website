import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { Navigation } from '@/components/landing/Navigation'
import { Footer } from '@/components/landing/Footer'
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer'
import { ArrowLeft, Clock, ChevronRight, Home } from 'lucide-react'

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: `${post.title} — Baseil Blog`,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  // Get all posts for prev/next navigation
  const allPosts = getAllPosts()
  const currentIndex = allPosts.findIndex(p => p.slug === slug)
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#C8D8C4] overflow-x-hidden">
      <Navigation />

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[5%] right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #52B788 0%, transparent 70%)' }}
        />
      </div>

      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02] baseil-grain" />

      <article className="relative z-10 pt-28 pb-20">
        <div className="max-w-[860px] mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-10 text-[0.78rem] font-[var(--font-outfit)]">
            <Link
              href="/"
              className="text-[#5A7A58] hover:text-[#52B788] transition-colors duration-300 flex items-center gap-1"
            >
              <Home size={12} />
              Home
            </Link>
            <ChevronRight size={12} className="text-[#3D5A3A]" />
            <Link
              href="/blog"
              className="text-[#5A7A58] hover:text-[#52B788] transition-colors duration-300"
            >
              Blog
            </Link>
            <ChevronRight size={12} className="text-[#3D5A3A]" />
            <span className="text-[#8FAF8A] truncate max-w-[200px]">{post.title}</span>
          </div>

          {/* Header */}
          <header className="mb-12">
            {/* Tags */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#52B788]/[0.06] border border-[#52B788]/[0.08] text-[0.65rem] font-[var(--font-outfit)] text-[#52B788]/60 uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-[var(--font-newsreader)] text-[clamp(1.8rem,4vw,2.6rem)] text-[#C8D8C4] leading-tight mb-4">
              {post.title}
            </h1>

            {/* Description */}
            {post.description && (
              <p className="font-[var(--font-outfit)] text-[1rem] text-[#8FAF8A] leading-relaxed mb-5">
                {post.description}
              </p>
            )}

            {/* Meta bar */}
            <div className="flex items-center gap-4 py-4 border-y border-[#52B788]/[0.06] text-[0.76rem] font-[var(--font-outfit)] text-[#5A7A58]">
              <span>{post.author}</span>
              <span className="w-px h-3 bg-[#52B788]/15" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="w-px h-3 bg-[#52B788]/15" />
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {post.readTime}
              </span>
            </div>
          </header>

          {/* Content */}
          <div className="blog-content">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Prev / Next navigation */}
          <nav className="mt-16 pt-8 border-t border-[#52B788]/[0.06]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group p-5 rounded-xl border border-[#52B788]/[0.06] hover:border-[#52B788]/15 hover:bg-[#111916]/40 transition-all duration-300"
                >
                  <span className="text-[0.68rem] font-[var(--font-outfit)] text-[#3D5A3A] uppercase tracking-wider block mb-1">
                    Previous
                  </span>
                  <span className="font-[var(--font-newsreader)] text-[0.95rem] text-[#8FAF8A] group-hover:text-[#C8D8C4] transition-colors duration-300 line-clamp-1">
                    {prevPost.title}
                  </span>
                </Link>
              ) : <div />}

              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group p-5 rounded-xl border border-[#52B788]/[0.06] hover:border-[#52B788]/15 hover:bg-[#111916]/40 transition-all duration-300 text-right"
                >
                  <span className="text-[0.68rem] font-[var(--font-outfit)] text-[#3D5A3A] uppercase tracking-wider block mb-1">
                    Next
                  </span>
                  <span className="font-[var(--font-newsreader)] text-[0.95rem] text-[#8FAF8A] group-hover:text-[#C8D8C4] transition-colors duration-300 flex items-center justify-end gap-1 line-clamp-1">
                    {nextPost.title}
                    <ChevronRight size={14} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ) : <div />}
            </div>
          </nav>
        </div>
      </article>

      <Footer />
    </div>
  )
}
