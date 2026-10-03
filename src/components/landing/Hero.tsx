'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { INSTALL_COMMAND } from '@/lib/install'
import { trackEvent } from '@/lib/analytics'
import { INSIGHTS } from '@/lib/sample-db'
import { HeroShowcase } from './showcase/HeroShowcase'
import { growLeaf } from './growLeaf'

// Each claim here is one the site already makes, worded to match the docs.
const FACTS = [
  ['Runs on your machine', 'macOS on Apple Silicon or Linux x64, from one install command.'],
  ['Read-only by default', 'Baseil enforces read-only at the SQL level. Pair it with a read-only database user.'],
  ['Shows its work', 'Every answer comes with the SQL that ran, so you can copy it and check.'],
  ['For people and agents', 'Ask in chat, or let your agents call it as MCP tools.'],
]

// A short rule drawn as a row of the leaf's dots.
const DOT_RULE = 'h-[5px] w-10 bg-[radial-gradient(circle,#7DA158_1.2px,transparent_1.7px)] bg-[length:6px_5px]'

/** A key figure and its label, shown inside the bubble. */
function Glimpse({ index }: { index: number }) {
  const { figure, label } = INSIGHTS[index]
  return (
    <>
      <p className="font-[family-name:var(--font-newsreader)] text-[1.35rem] leading-none text-[#E2EBDE]">{figure}</p>
      <p className="mt-1.5 font-mono text-[0.5rem] uppercase leading-[1.35] tracking-[0.08em] text-[#8FAF8A]">{label}</p>
    </>
  )
}

export function Hero() {
  return (
    <>
      <LeafStage />

      <section aria-label="What Baseil is" className="relative px-6 pb-20">
        <dl className="mx-auto grid max-w-[1200px] grid-cols-1 border-t border-[#52B788]/15 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map(([title, detail]) => (
            <div key={title} className="py-6 sm:pr-8 lg:border-l lg:border-[#52B788]/10 lg:pl-6 lg:first:border-l-0 lg:first:pl-0">
              <dt className="font-[family-name:var(--font-newsreader)] text-[1.3rem] text-[#E2EBDE]">{title}</dt>
              <dd className="mt-2 font-[family-name:var(--font-outfit)] text-[0.9rem] leading-relaxed text-[#8FAF8A]">{detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-[900px]">
          <p className="mb-4 font-[family-name:var(--font-outfit)] text-[0.72rem] uppercase tracking-[0.25em] text-[#52B788]">
            // See it in action
          </p>
          <div className="overflow-hidden rounded-2xl border border-[#52B788]/15">
            <HeroShowcase />
          </div>
        </div>
      </section>
    </>
  )
}

/** The leaf, its bubble, and the headline. Hover state lives here, so it re-renders nothing below. */
function LeafStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || !boxRef.current || !lensRef.current) return

    return growLeaf({
      canvas: canvasRef.current,
      box: boxRef.current,
      lens: lensRef.current,
      src: '/robot/robot-leaf.webp',
      reduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
      // The bubble keeps its last answer while it fades out.
      onRegion: (next) => {
        if (next !== null) setShown(next)
      },
    })
  }, [])

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND)
      setCopied(true)
      trackEvent('cta_click', { button_label: 'copy_install', section: 'hero' })
    } catch {
      // Clipboard can be blocked; the command stays selectable on the page.
    }
  }

  return (
    <section className="relative min-h-[100svh] overflow-hidden flex flex-col items-center justify-center px-6 pt-[112px] pb-14">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* The bubble: an answer that rides in the clearing the rows make for it. */}
      <div
        ref={lensRef}
        aria-hidden="true"
        data-open="false"
        className="peer pointer-events-none absolute left-0 top-0 z-20 w-[96px] scale-95 text-center opacity-0 transition-[opacity,scale] duration-200 ease-out data-[open=true]:scale-100 data-[open=true]:opacity-100"
      >
        <div key={shown} className="animate-in fade-in duration-200">
          <Glimpse index={shown} />
        </div>
      </div>

      {/* The leaf's box: CSS decides where the sprout grows and how big it is. */}
      <div ref={boxRef} aria-hidden="true" className="relative w-full max-w-[600px] h-[clamp(180px,36svh,400px)]" />

      {/* The sprout's own label, set just under its soil. With a mouse the bubble opens below the
          pointer and can reach the label, so the label clears out of its way while it is open. */}
      <p className="relative z-10 mt-3 flex items-center justify-center gap-4 font-mono text-[0.7rem] uppercase tracking-[0.32em] text-[#8DBEB7] transition-opacity duration-300 sm:mt-2 pointer-fine:peer-data-[open=true]:opacity-0">
        <span aria-hidden="true" className={DOT_RULE} />
        AI data harness
        <span aria-hidden="true" className={DOT_RULE} />
      </p>

      {/* w-full: a centred flex item sizes to its content, and the nowrap command would widen it. */}
      <div className="relative z-10 mt-14 w-full max-w-[1000px] text-center sm:mt-16">
        <h1 className="leaf-type font-[family-name:var(--font-newsreader)] text-[clamp(2.5rem,6.2vw,5.4rem)] font-normal leading-[1] tracking-[-0.025em] [text-wrap:balance]">
          Get all your data talking<span className="leaf-dot">.</span>
        </h1>
        {/* Onboarding takes up to about five minutes, depending on the database, so no hard number. */}
        <p className="mx-auto mt-7 max-w-[600px] font-[family-name:var(--font-outfit)] text-[clamp(1rem,1.4vw,1.15rem)] leading-relaxed text-[#A3BB9E] [text-wrap:pretty]">
          Onboard your data in a few minutes, then ask questions in plain English and see exactly how every answer was found.
        </p>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex max-w-full items-center rounded-full border border-[#52B788]/25 bg-[#0A0F0D]/70">
            <span aria-hidden="true" className="select-none pl-5 pr-3 font-mono text-[0.74rem] text-[#52B788] sm:pl-6 sm:text-[0.82rem]">
              $
            </span>
            <code className="min-w-0 overflow-x-auto whitespace-nowrap pr-1 font-mono text-[0.74rem] text-[#A3BB9E] [scrollbar-width:none] sm:text-[0.82rem]">
              {INSTALL_COMMAND}
            </code>
            <button
              type="button"
              onClick={copyCommand}
              aria-label="Copy install command"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[#C8D8C4] transition-colors duration-150 hover:text-[#52B788]"
            >
              {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* A plain link: /scroll ships its own global styles, so it gets a full page load. */}
        <a
          href="/scroll"
          className="mt-8 inline-block font-mono text-[0.78rem] text-[#8FAF8A] underline decoration-[#52B788]/40 underline-offset-4 transition-colors duration-150 hover:text-[#C8D8C4]"
        >
          Take the deep dive
        </a>
      </div>
    </section>
  )
}
