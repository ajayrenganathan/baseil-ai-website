'use client'

import { useEffect, useRef, useState } from 'react'
import { baseilMermaidConfig } from '@/lib/mermaid-theme'

let mermaidPromise: Promise<typeof import('mermaid').default> | null = null
function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then(mod => {
      mod.default.initialize(baseilMermaidConfig)
      return mod.default
    })
  }
  return mermaidPromise
}

let counter = 0

export function MermaidDiagram({ source }: { source: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const idRef = useRef(`baseil-mermaid-${++counter}`)

  useEffect(() => {
    let cancelled = false
    loadMermaid()
      .then(mermaid => mermaid.render(idRef.current, source))
      .then(({ svg }) => {
        if (cancelled) return
        if (ref.current) ref.current.innerHTML = svg
      })
      .catch(err => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
      })
    return () => { cancelled = true }
  }, [source])

  if (error) {
    return (
      <div className="my-6 p-4 rounded-xl border border-red-500/20 bg-red-500/[0.04] font-[var(--font-outfit)] text-[0.85rem] text-red-300">
        Diagram failed to render: {error}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="my-6 p-6 rounded-xl border border-[#52B788]/[0.08] bg-[#0D1410]/60 overflow-x-auto flex justify-center"
    />
  )
}
