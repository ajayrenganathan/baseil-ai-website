'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/landing/Navigation'
import { Footer } from '@/components/landing/Footer'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const DATABASES = [
  { label: 'PostgreSQL', y: 100 },
  { label: 'MySQL', y: 200 },
  { label: 'MongoDB', y: 300 },
  { label: 'Redis', y: 400 },
  { label: 'S3 Files', y: 500 },
]

const CONSUMERS = [
  { label: 'Humans', y: 150 },
  { label: 'Agents', y: 300 },
  { label: 'Apps', y: 450 },
]

/* ─── Small icon components ─── */

function DbIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-20" y="-20" width="40" height="40" rx="8" fill="#151D18" stroke="rgba(82,183,136,0.12)" strokeWidth="1" />
      {/* DB cylinder icon */}
      <ellipse cx="0" cy="-6" rx="10" ry="4" fill="none" stroke="#52B788" strokeWidth="1.2" opacity="0.5" />
      <line x1="-10" y1="-6" x2="-10" y2="6" stroke="#52B788" strokeWidth="1.2" opacity="0.5" />
      <line x1="10" y1="-6" x2="10" y2="6" stroke="#52B788" strokeWidth="1.2" opacity="0.5" />
      <ellipse cx="0" cy="6" rx="10" ry="4" fill="none" stroke="#52B788" strokeWidth="1.2" opacity="0.5" />
    </g>
  )
}

function ConsumerIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-20" y="-20" width="40" height="40" rx="8" fill="#151D18" stroke="rgba(82,183,136,0.12)" strokeWidth="1" />
      {/* Person/bot icon */}
      <circle cx="0" cy="-5" r="5" fill="none" stroke="#52B788" strokeWidth="1.2" opacity="0.5" />
      <path d="M-8,10 Q-8,2 0,2 Q8,2 8,10" fill="none" stroke="#52B788" strokeWidth="1.2" opacity="0.5" />
    </g>
  )
}

function BaseilCenter({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Outer glow */}
      <circle r="60" fill="radial-gradient(circle, rgba(82,183,136,0.08) 0%, transparent 70%)" opacity="0.5" />
      <circle r="52" fill="none" stroke="rgba(82,183,136,0.08)" strokeWidth="1">
        <animate attributeName="r" values="52;56;52" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.4;1" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Card */}
      <rect x="-36" y="-36" width="72" height="72" rx="16" fill="#151D18" stroke="rgba(82,183,136,0.2)" strokeWidth="1.5" />
      {/* Baseil leaf icon */}
      <path d="M-2,-14 C-2,-14 -14,0 -10,10 C-8,14 -2,14 0,10 C2,14 8,14 10,10 C14,0 2,-14 2,-14 C2,-14 0,-16 -2,-14 Z"
        fill="none" stroke="#52B788" strokeWidth="1.5" opacity="0.7" />
      <path d="M0,-8 C0,-8 -4,0 0,8" fill="none" stroke="#52B788" strokeWidth="1" opacity="0.5" />
      {/* Label */}
      <text x="0" y="52" textAnchor="middle" fontSize="13" fill="#52B788" fontFamily="var(--font-outfit)" opacity="0.7">baseil</text>
    </g>
  )
}

/* ─── Connection line with dot ─── */
function ConnectionLine({ x1, y1, x2, y2, color, opacity: op = 0.3 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; opacity?: number
}) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" opacity={op} />
      {/* Traveling dot */}
      <circle r="3" fill={color} opacity="0.7">
        <animateMotion dur={`${2 + Math.random() * 1.5}s`} repeatCount="indefinite"
          path={`M${x1},${y1} L${x2},${y2}`} />
      </circle>
    </g>
  )
}

export default function ProblemPage() {
  const [slide, setSlide] = useState(0) // 0 = without, 1 = with baseil

  // Auto cycle
  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s === 0 ? 1 : 0)), 6000)
    return () => clearInterval(timer)
  }, [])

  const CX = 480 // center x
  const CY = 300 // center y
  const DB_X = 120 // database column x
  const CON_X = 840 // consumer column x

  return (
    <div className="min-h-screen bg-[#0A0F0D] text-[#C8D8C4] overflow-x-hidden">
      <Navigation />

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #52B788 0%, transparent 70%)' }} />
      </div>
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02] baseil-grain" />

      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-[1100px] mx-auto px-6">
          {/* Back */}
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-[0.78rem] font-[var(--font-outfit)] text-[#5A7A58] hover:text-[#52B788] transition-colors duration-300 mb-8 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-8">
            <span className="text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/50 mb-3 block">
              // Architecture
            </span>
            <h1 className="font-[var(--font-newsreader)] text-[clamp(1.8rem,3.5vw,2.6rem)] text-[#C8D8C4] leading-tight">
              Why your agents need Baseil.
            </h1>
          </div>

          {/* Slide toggle */}
          <div className="flex items-center gap-1 mb-6">
            <button
              onClick={() => setSlide(0)}
              className={`px-4 py-2 rounded-md text-[0.78rem] font-[var(--font-outfit)] font-medium transition-all duration-300 cursor-pointer ${
                slide === 0
                  ? 'bg-[#E74C4C]/10 text-[#E74C4C] border border-[#E74C4C]/20'
                  : 'text-[#5A7A58] border border-transparent hover:text-[#8FAF8A]'
              }`}
            >
              Without Baseil
            </button>
            <button
              onClick={() => setSlide(1)}
              className={`px-4 py-2 rounded-md text-[0.78rem] font-[var(--font-outfit)] font-medium transition-all duration-300 cursor-pointer ${
                slide === 1
                  ? 'bg-[#52B788]/10 text-[#52B788] border border-[#52B788]/20'
                  : 'text-[#5A7A58] border border-transparent hover:text-[#8FAF8A]'
              }`}
            >
              With Baseil
            </button>
          </div>

          {/* Diagram card */}
          <div className="rounded-2xl border border-[#52B788]/[0.06] bg-[#111916]/40 overflow-hidden">
            {/* Description text */}
            <div className="px-10 pt-10 pb-2 text-center">
              <p className="font-[var(--font-newsreader)] text-[clamp(1rem,2vw,1.25rem)] italic text-[#8FAF8A] leading-relaxed max-w-[700px] mx-auto transition-opacity duration-500">
                {slide === 0
                  ? 'Every agent wired to every database. Schema chaos, credential sprawl, and one breaking change away from collapse.'
                  : 'Intelligence at the data layer itself. One calm layer that deciphers what data you need and where it lives.'
                }
              </p>
            </div>

            {/* SVG Diagram */}
            <svg viewBox="0 0 960 600" className="w-full block" style={{ maxHeight: '500px' }}>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* ─── SLIDE 0: Without Baseil ─── */}
              {slide === 0 && (
                <g>
                  {/* Spaghetti: every consumer → every database */}
                  {CONSUMERS.map((con, ci) =>
                    DATABASES.map((db, di) => (
                      <ConnectionLine
                        key={`chaos-${ci}-${di}`}
                        x1={CON_X - 20} y1={con.y}
                        x2={DB_X + 20} y2={db.y}
                        color="#E74C4C"
                        opacity={0.12 + (ci + di) * 0.02}
                      />
                    ))
                  )}
                </g>
              )}

              {/* ─── SLIDE 1: With Baseil ─── */}
              {slide === 1 && (
                <g>
                  {/* Databases → Baseil */}
                  {DATABASES.map((db, i) => (
                    <ConnectionLine
                      key={`db-b-${i}`}
                      x1={DB_X + 20} y1={db.y}
                      x2={CX - 36} y2={CY}
                      color="#52B788"
                      opacity={0.25}
                    />
                  ))}

                  {/* Baseil → Consumers */}
                  {CONSUMERS.map((con, i) => (
                    <ConnectionLine
                      key={`b-con-${i}`}
                      x1={CX + 36} y1={CY}
                      x2={CON_X - 20} y2={con.y}
                      color="#52B788"
                      opacity={0.25}
                    />
                  ))}

                  {/* Baseil center node */}
                  <BaseilCenter x={CX} y={CY} />
                </g>
              )}

              {/* ─── DATABASE NODES (always visible, left side) ─── */}
              {DATABASES.map((db, i) => (
                <g key={`db-${i}`}>
                  <DbIcon x={DB_X} y={db.y} />
                  <text x={DB_X + 30} y={db.y + 5} fontSize="13" fill="#8FAF8A"
                    fontFamily="var(--font-outfit)" opacity="0.8">{db.label}</text>
                </g>
              ))}

              {/* ─── CONSUMER NODES (always visible, right side) ─── */}
              {CONSUMERS.map((con, i) => (
                <g key={`con-${i}`}>
                  <text x={CON_X - 30} y={con.y + 5} fontSize="13" fill="#8FAF8A"
                    fontFamily="var(--font-outfit)" textAnchor="end" opacity="0.8">{con.label}</text>
                  <ConsumerIcon x={CON_X} y={con.y} />
                </g>
              ))}

              {/* "Without" label in center for slide 0 */}
              {slide === 0 && (
                <g>
                  <text x={CX} y={CY - 10} textAnchor="middle" fontSize="11" fill="#E74C4C"
                    fontFamily="monospace" opacity="0.5">direct connections</text>
                  <text x={CX} y={CY + 8} textAnchor="middle" fontSize="11" fill="#E74C4C"
                    fontFamily="monospace" opacity="0.5">{DATABASES.length * CONSUMERS.length} routes</text>
                </g>
              )}
            </svg>
          </div>

          {/* CTA */}
          <div className="mt-10 flex items-center gap-6">
            <Link href="/#early-access"
              className="baseil-cta-primary text-[0.85rem] px-6 py-2.5 inline-flex items-center gap-2">
              Join the Waitlist
              <ArrowRight size={15} />
            </Link>
            <p className="font-[var(--font-newsreader)] text-[0.9rem] italic text-[#5A7A58]">
              Stop wiring. Start asking.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
