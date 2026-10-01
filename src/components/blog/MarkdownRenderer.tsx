'use client'

import { createContext, useContext, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { MermaidDiagram } from './MermaidDiagram'

// react-markdown 10 no longer tells `li` whether its parent list is ordered,
// so the list components publish that here and `li` reads it back.
const OrderedListContext = createContext(false)

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        h1: ({ children }) => (
          <h1 className="font-[var(--font-newsreader)] text-[2rem] text-[#C8D8C4] mt-12 mb-4 leading-tight">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="font-[var(--font-newsreader)] text-[1.5rem] text-[#C8D8C4] mt-10 mb-3 leading-tight">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-[var(--font-newsreader)] text-[1.2rem] text-[#C8D8C4] mt-8 mb-2 leading-snug">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="font-[var(--font-outfit)] text-[0.92rem] text-[#8FAF8A] leading-[1.8] mb-5">
            {children}
          </p>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-[#52B788] hover:text-[#6FCF97] underline underline-offset-2 decoration-[#52B788]/30 hover:decoration-[#52B788]/60 transition-colors duration-300"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className="text-[#C8D8C4] font-semibold">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="text-[#8FAF8A] italic">{children}</em>
        ),
        ul: ({ children }) => (
          <OrderedListContext.Provider value={false}>
            <ul className="space-y-2 mb-5 pl-1">{children}</ul>
          </OrderedListContext.Provider>
        ),
        ol: ({ children }) => (
          <OrderedListContext.Provider value={true}>
            <ol className="space-y-2 mb-5 pl-6 list-decimal marker:text-[#52B788]/60">{children}</ol>
          </OrderedListContext.Provider>
        ),
        li: ({ children }) => <ListItem>{children}</ListItem>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-[#52B788]/30 pl-5 my-6 py-1">
            {children}
          </blockquote>
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className
          if (isInline) {
            return (
              <code className="font-mono text-[0.85em] text-[#6FCF97] bg-[#52B788]/[0.08] px-1.5 py-0.5 rounded-md border border-[#52B788]/[0.08]">
                {children}
              </code>
            )
          }
          if (className === 'language-mermaid') {
            const source = String(children).replace(/\n$/, '')
            return <MermaidDiagram source={source} />
          }
          return (
            <code className={`${className} block`} {...props}>
              {children}
            </code>
          )
        },
        pre: ({ children }) => {
          const firstChild = Array.isArray(children) ? children[0] : children
          if (firstChild && typeof firstChild === 'object' && 'type' in (firstChild as object)) {
            const type = (firstChild as { type?: unknown }).type
            if (type === MermaidDiagram) {
              return <>{children}</>
            }
          }
          return (
            <pre className="bg-[#0D1410] border border-[#52B788]/[0.08] rounded-xl p-5 mb-6 overflow-x-auto text-[0.84rem] leading-[1.7] font-mono text-[#8FAF8A] scrollbar-thin">
              {children}
            </pre>
          )
        },
        hr: () => (
          <hr className="border-0 h-[1px] bg-gradient-to-r from-transparent via-[#52B788]/15 to-transparent my-10" />
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-6 rounded-xl border border-[#52B788]/[0.08]">
            <table className="w-full text-[0.88rem]">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-[#52B788]/[0.04] border-b border-[#52B788]/[0.08]">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left font-[var(--font-outfit)] font-medium text-[#C8D8C4] text-[0.82rem]">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 font-[var(--font-outfit)] text-[#8FAF8A] border-t border-[#52B788]/[0.04]">
            {children}
          </td>
        ),
        img: ({ src, alt }) => {
          if (!src || typeof src !== 'string' || !/^(https?:\/\/|\/|\.\/)/.test(src)) return null
          return (
            <span className="block my-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt || ''}
                className="rounded-xl border border-[#52B788]/[0.08] max-w-full"
              />
            </span>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

function ListItem({ children }: { children?: ReactNode }) {
  const ordered = useContext(OrderedListContext)
  const base = 'font-[var(--font-outfit)] text-[0.92rem] text-[#8FAF8A] leading-[1.8]'

  // Ordered items keep the native decimal marker, which hangs in the `pl-6`
  // gutter so wrapped lines stay aligned. Unordered items draw their own bullet.
  if (ordered) {
    return <li className={base}>{children}</li>
  }

  return (
    <li className={`${base} flex gap-2`}>
      <span className="text-[#52B788]/60 mt-[2px] shrink-0">&#8227;</span>
      <span>{children}</span>
    </li>
  )
}
