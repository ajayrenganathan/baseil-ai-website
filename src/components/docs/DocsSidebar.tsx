'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { DocPage } from '@/lib/docs'

interface DocsSidebarProps {
  docs: Pick<DocPage, 'slug' | 'title' | 'category'>[]
}

export function DocsSidebar({ docs }: DocsSidebarProps) {
  const pathname = usePathname()

  // Group by category, preserving order within each
  const grouped = docs.reduce<Record<string, typeof docs>>((acc, doc) => {
    const cat = doc.category || 'general'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(doc)
    return acc
  }, {})

  const categoryLabels: Record<string, string> = {
    'getting-started': 'Getting Started',
    'guides': 'Guides',
    'reference': 'Reference',
    'general': 'General',
  }

  return (
    <nav className="w-full md:w-64 md:shrink-0 md:sticky md:top-28 md:self-start">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h4 className="text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/60 mb-2 px-3">
            {categoryLabels[category] || category}
          </h4>
          <ul className="space-y-0.5">
            {items.map(doc => {
              const href = `/docs/${doc.slug}`
              const active = pathname === href
              return (
                <li key={doc.slug}>
                  <Link
                    href={href}
                    className={`block px-3 py-2 rounded-lg text-[0.88rem] font-[var(--font-outfit)] transition-colors duration-200 ${
                      active
                        ? 'bg-[#52B788]/[0.1] text-[#C8D8C4] border-l-2 border-[#52B788]'
                        : 'text-[#8FAF8A] hover:text-[#C8D8C4] hover:bg-[#52B788]/[0.04]'
                    }`}
                  >
                    {doc.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
