'use client'

import './engine/scrollcraft.css'
import './bloom.css'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { INSTALL_COMMAND } from '@/lib/install'
import { trackEvent } from '@/lib/analytics'
import type { ScrollCraftApi } from './engine/scrollcraft'
import { startFilm } from './film'
import { ANSWER, QUESTION, SCHEMA_TOTALS, querySql } from '@/lib/sample-db'

// Links that leave this page are plain <a> on purpose: the engine stylesheet
// themes html, body and focus rings globally, and a full page load is what
// keeps that from following a client-side navigation onto other routes.

const SQL = querySql()
const TOP = ANSWER[0]
const count = new Intl.NumberFormat('en-US').format

const KEYWORDS = /\b(SELECT|FROM|LEFT JOIN|JOIN|ON|GROUP BY|ORDER BY|AS|DESC)\b/
function highlight(line: string) {
  return line.split(KEYWORDS).map((part, i) =>
    i % 2 ? (
      <span key={i} className="kw">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

const trackInstall = (section: string) => () => trackEvent('cta_click', { button_label: 'install', section })

export function DataBloom() {
  const rootRef = useRef<HTMLDivElement>(null)
  const filmRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLCanvasElement>(null)
  const frontRef = useRef<HTMLCanvasElement>(null)
  const [api, setApi] = useState<ScrollCraftApi | null>(null)
  const [copied, setCopied] = useState(false)

  // The engine reads matchMedia when it loads, so it can only load in the browser.
  useEffect(() => {
    let alive = true
    let mounted: ScrollCraftApi | null = null
    import('./engine/scrollcraft.js')
      .then(() => {
        if (!alive || !rootRef.current || !window.ScrollCraft) return
        mounted = window.ScrollCraft.mount(rootRef.current)
        setApi(mounted)
      })
      .catch((error) => console.error('[scroll] engine failed to load', error))
    return () => {
      alive = false
      mounted?.destroy()
      // Drift paints the page ground onto <html>; take it back with us.
      document.documentElement.style.removeProperty('--sc-canvas')
      setApi(null)
    }
  }, [])

  useEffect(() => {
    if (!api || !backRef.current || !frontRef.current || !filmRef.current) return
    return startFilm({
      back: backRef.current,
      front: frontRef.current,
      film: filmRef.current,
      api,
      reduce: window.ScrollCraft?.reduce ?? false,
      leafSrc: '/robot/robot-leaf.webp',
    })
  }, [api])

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND)
      setCopied(true)
    } catch {
      // Clipboard can be blocked; the command stays selectable on the page.
    }
  }

  return (
    <div className="bl" ref={rootRef}>
      <div className="bl-film" ref={filmRef} aria-hidden="true" data-sc-verify-state="">
        <canvas ref={backRef} />
      </div>
      <canvas className="bl-front" ref={frontRef} aria-hidden="true" />
      <div className="sc-grain" aria-hidden="true" />

      <header className="bl-bar">
        <a className="bl-mark" href="/">
          <Image src="/robot/robot-leaf.png" alt="" width={26} height={18} />
          Baseil
        </a>
        <a className="bl-bar__cta" href="/docs/quickstart" onClick={trackInstall('scroll_preview_bar')}>
          Install
        </a>
      </header>

      <main className="bl-main">
        {/* 1 · Awe: the camera flies into every row of the database */}
        <section id="hero" data-sc-act="pin" data-sc-span="2.2" data-sc-drift="#050807">
          <div data-sc-stage>
            <div className="sc-scrim sc-scrim--lead" aria-hidden="true" />
            <div className="sc-copy sc-copy--lead" data-sc-cue="0 0.6 0">
              <h1 className="bl-h1" data-sc-kinetic="lines">
                Your database is full of answers.
              </h1>
              <p className="bl-lede">
                Baseil finds them. It maps your tables on its own and answers in plain English, with the query that
                ran.
              </p>
            </div>
            <p className="bl-caption" data-sc-cue="0 0.6 0">
              Each dot is one row of a sample store database: {count(SCHEMA_TOTALS.rows)} rows in{' '}
              {SCHEMA_TOTALS.tables} tables.
            </p>
          </div>
        </section>

        {/* 2 · Relief: the rows sort themselves into tables */}
        <section id="map" data-sc-act="pin" data-sc-span="2.4" data-sc-drift="#0A0F0D">
          <div data-sc-stage>
            <div className="sc-scrim sc-scrim--trail" aria-hidden="true" />
            <div className="sc-copy sc-copy--trail bl-block" data-sc-cue="0.34 1 0.12 0.08">
              <h2 className="bl-h2">It sorts itself out.</h2>
              <p className="bl-body">
                Baseil reads every table, column, and relationship, then builds read-only query tools on top. Nobody
                writes a schema doc.
              </p>
              <p className="bl-stats">
                <span data-sc-count={`0 ${SCHEMA_TOTALS.tables}`} data-sc-count-at="0.36 0.6">
                  0
                </span>{' '}
                tables,{' '}
                <span data-sc-count={`0 ${SCHEMA_TOTALS.columns}`} data-sc-count-at="0.4 0.66">
                  0
                </span>{' '}
                columns,{' '}
                <span data-sc-count={`0 ${SCHEMA_TOTALS.relationships}`} data-sc-count-at="0.46 0.72">
                  0
                </span>{' '}
                relationships
              </p>
            </div>
          </div>
        </section>

        {/* 3 · Anticipation: the lights go down and the question arrives */}
        <section id="ask" data-sc-act="pin" data-sc-span="1.4" data-sc-drift="#030504">
          <div data-sc-stage>
            <div className="sc-copy sc-copy--center bl-ask" data-sc-cue="0.12 1 0.18 0.1">
              <p className="bl-ask__lead">Then you just ask.</p>
              <h2 className="bl-question" data-sc-kinetic="words">
                {QUESTION.text}
              </h2>
            </div>
          </div>
        </section>

        {/* 4 · The peak: the rows fly into the answer */}
        <section id="answer" data-sc-act="pin" data-sc-span="3.6" data-sc-drift="#050807">
          <div data-sc-stage>
            <div className="sc-scrim sc-scrim--lead" aria-hidden="true" />
            <div className="sc-copy sc-copy--lead bl-block" data-sc-cue="0.64 1 0.1 0.03">
              <h2 className="bl-h2 bl-h2--lg">{TOP.name} gets returned the most.</h2>
              <p className="bl-body">
                <span className="bl-num" data-sc-count={`0 ${TOP.returns}`} data-sc-count-at="0.62 0.74">
                  0
                </span>{' '}
                of {TOP.lines} order lines came back. Every dot that moved is a real row: each return found its order
                line, each line found its category, and the stacks are the count.
              </p>
              <p className="bl-path">Joined {SQL.path.join(' › ')}</p>
            </div>
            <figure className="bl-sql" data-sc-cue="0.7 1 0.1 0.03">
              <figcaption>The query that ran</figcaption>
              <pre>
                <code>
                  {SQL.lines.map((l, i) => (
                    <span key={i} className="bl-sql__line">
                      {highlight(l.text)}
                    </span>
                  ))}
                </code>
              </pre>
            </figure>
          </div>
        </section>

        {/* 5 · Resolve: every row becomes Baseil, and the page holds */}
        <section id="close" data-sc-act="pin" data-sc-span="1.4">
          <div data-sc-stage className="bl-close">
            <div className="bl-close__inner" data-sc-cue="0 1 0 0">
              <h2 className="bl-h2 bl-h2--lg">Get all your data talking.</h2>
              <p className="bl-body">
                Ask in chat, or let your agents ask over MCP. Every answer comes with the query that ran.
              </p>
              <div className="bl-actions">
                <a
                  className="bl-cta"
                  href="/docs/quickstart"
                  data-sc-magnet="0.26"
                  onClick={trackInstall('scroll_preview_close')}
                >
                  Install
                </a>
                <div className="bl-cmd">
                  <code>{INSTALL_COMMAND}</code>
                  <button type="button" onClick={copyCommand} aria-label="Copy install command">
                    {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                  </button>
                </div>
              </div>
            </div>
            <footer className="bl-foot">
              <span>Baseil. The data on this page is a seeded sample.</span>
              <nav aria-label="Site">
                <a href="/">Home</a>
                <a href="/docs">Docs</a>
                <a href="/pricing">Pricing</a>
                <a href="/blog">Blog</a>
              </nav>
            </footer>
          </div>
        </section>
      </main>
    </div>
  )
}
