'use client'

import { useEffect, useRef, useState, useCallback, type MouseEvent } from 'react'
import { Database, Bot, AlertTriangle, Leaf } from 'lucide-react'

/** Compute tilt angles from mouse position relative to element center */
function getTilt(e: MouseEvent, el: HTMLElement, maxDeg = 6) {
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  // normalise to -1…1
  const nx = (e.clientX - cx) / (rect.width / 2)
  const ny = (e.clientY - cy) / (rect.height / 2)
  return {
    rotateX: -(ny * maxDeg),   // tilt up/down
    rotateY: nx * maxDeg,      // tilt left/right
    glowX: ((e.clientX - rect.left) / rect.width) * 100,
    glowY: ((e.clientY - rect.top) / rect.height) * 100,
  }
}

export function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const beforeCardRef = useRef<HTMLDivElement>(null)
  const afterCardRef = useRef<HTMLDivElement>(null)

  const [visible, setVisible] = useState(false)
  const [resolved, setResolved] = useState(false)

  // 3D tilt state for before/after cards
  const [beforeTilt, setBeforeTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [afterTilt, setAfterTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [beforeGlow, setBeforeGlow] = useState({ x: 50, y: 50 })
  const [afterGlow, setAfterGlow] = useState({ x: 50, y: 50 })

  // Intersection observer — trigger entrance + resolve
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          setTimeout(() => setResolved(true), 2400)
        }
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // ---- Mouse handlers for 3D tilt + inner glow ----

  const handleBeforeMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!beforeCardRef.current) return
    const t = getTilt(e, beforeCardRef.current)
    setBeforeTilt({ rotateX: t.rotateX, rotateY: t.rotateY })
    setBeforeGlow({ x: t.glowX, y: t.glowY })
  }, [])

  const handleBeforeLeave = useCallback(() => {
    setBeforeTilt({ rotateX: 0, rotateY: 0 })
    setBeforeGlow({ x: 50, y: 50 })
  }, [])

  const handleAfterMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!afterCardRef.current) return
    const t = getTilt(e, afterCardRef.current)
    setAfterTilt({ rotateX: t.rotateX, rotateY: t.rotateY })
    setAfterGlow({ x: t.glowX, y: t.glowY })
  }, [])

  const handleAfterLeave = useCallback(() => {
    setAfterTilt({ rotateX: 0, rotateY: 0 })
    setAfterGlow({ x: 50, y: 50 })
  }, [])

  return (
    <section id="problem" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#52B788]/15 to-transparent" />

      <div className="max-w-[1100px] mx-auto px-6">
        {/* Section label */}
        <div className="text-center mb-16">
          <span className="text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/50 mb-4 block">
            The Problem
          </span>
          <h2 className="font-[var(--font-newsreader)] text-[clamp(2rem,4vw,3.2rem)] text-[#C8D8C4] leading-tight">
            The bottleneck is already here.
          </h2>
        </div>

        {/* Before / After visual */}
        <div className="relative max-w-[800px] mx-auto" style={{ perspective: '800px' }}>
          {/* ============================================================
              BEFORE state — chaos
              ============================================================ */}
          <div
            className={`transition-all duration-1000 origin-center ${
              resolved
                ? 'opacity-0 scale-90 rotate-[-2deg] absolute inset-0 pointer-events-none'
                : 'opacity-100 scale-100 rotate-0'
            }`}
          >
            <div
              ref={beforeCardRef}
              onMouseMove={handleBeforeMove}
              onMouseLeave={handleBeforeLeave}
              className="relative bg-[#111916]/80 border border-[#C9672E]/10 rounded-2xl p-10 overflow-hidden tilt-card hover-inner-glow"
              style={{
                transform: `perspective(800px) rotateX(${beforeTilt.rotateX}deg) rotateY(${beforeTilt.rotateY}deg)`,
                '--glow-x': `${beforeGlow.x}%`,
                '--glow-y': `${beforeGlow.y}%`,
              } as React.CSSProperties}
            >
              <div className="absolute inset-0 baseil-grain opacity-[0.02]" />

              <div className="flex flex-col items-center gap-8">
                <p className="font-[var(--font-outfit)] text-[1rem] text-[#5A7A58] text-center max-w-[500px] leading-relaxed">
                  Today&apos;s agents wear too many hats. Understanding users, hunting across databases, formulating queries, formatting responses. Every new data source increases hallucinations.
                </p>

                <div className="relative w-full max-w-[600px] h-[200px]">
                  {/* Database icons scattered */}
                  {[
                    { icon: Database, label: 'PostgreSQL', x: '5%', y: '20%', delay: '0s' },
                    { icon: Database, label: 'MySQL', x: '85%', y: '10%', delay: '0.2s' },
                    { icon: Database, label: 'MongoDB', x: '0%', y: '75%', delay: '0.4s' },
                    { icon: Database, label: 'APIs', x: '90%', y: '70%', delay: '0.6s' },
                  ].map((db, i) => (
                    <div
                      key={i}
                      className={`absolute transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}
                      style={{ left: db.x, top: db.y, transitionDelay: db.delay }}
                    >
                      <div className="flex flex-col items-center gap-1 group/db">
                        <div className="w-10 h-10 rounded-lg bg-[#0A0F0D] border border-[#C9672E]/20 flex items-center justify-center transition-shadow duration-300 group-hover/db:shadow-[0_0_12px_rgba(201,103,46,0.3)]">
                          <db.icon size={18} className="text-[#C9672E]/60 transition-colors duration-300 group-hover/db:text-[#C9672E]/90" />
                        </div>
                        <span className="text-[0.65rem] font-[var(--font-outfit)] text-[#3D5A3A]">{db.label}</span>
                      </div>
                    </div>
                  ))}

                  {/* Central overwhelmed agent */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-14 h-14 rounded-xl bg-[#0A0F0D] border border-amber-600/25 flex items-center justify-center transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(245,158,11,0.35)] ${visible ? 'animate-pulse' : ''}`}>
                      <Bot size={24} className="text-amber-500/70" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <AlertTriangle size={14} className="text-amber-500 animate-pulse" />
                    </div>
                  </div>

                  {/* Tangled lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 200">
                    {[
                      'M 50 50 Q 150 90 300 100',
                      'M 540 30 Q 400 80 300 100',
                      'M 30 160 Q 180 120 300 100',
                      'M 560 150 Q 420 130 300 100',
                    ].map((d, i) => (
                      <path
                        key={i}
                        d={d}
                        fill="none"
                        stroke="rgba(201, 103, 46, 0.15)"
                        strokeWidth="1"
                        strokeDasharray="4 6"
                        className={`transition-all duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
                        style={{ transitionDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              AFTER state — calm
              ============================================================ */}
          <div
            className={`transition-all duration-1000 delay-200 origin-center ${
              resolved
                ? 'opacity-100 scale-100 rotate-0'
                : 'opacity-0 scale-105 rotate-[1deg] absolute inset-0 pointer-events-none'
            }`}
          >
            <div
              ref={afterCardRef}
              onMouseMove={handleAfterMove}
              onMouseLeave={handleAfterLeave}
              className="relative bg-[#111916]/80 border border-[#52B788]/10 rounded-2xl p-10 overflow-hidden tilt-card hover-inner-glow"
              style={{
                transform: `perspective(800px) rotateX(${afterTilt.rotateX}deg) rotateY(${afterTilt.rotateY}deg)`,
                '--glow-x': `${afterGlow.x}%`,
                '--glow-y': `${afterGlow.y}%`,
              } as React.CSSProperties}
            >
              <div className="absolute inset-0 baseil-grain opacity-[0.02]" />

              <div className="flex flex-col items-center gap-8">
                <p className="font-[var(--font-outfit)] text-[1rem] text-[#8FAF8A] text-center max-w-[500px] leading-relaxed">
                  Intelligence at the data layer itself. One calm layer that deciphers what data you need and where it lives.
                </p>

                <div className="relative w-full max-w-[600px] h-[200px]">
                  {/* Databases on the left */}
                  {[
                    { label: 'PostgreSQL', y: '15%' },
                    { label: 'MySQL', y: '42%' },
                    { label: 'MongoDB', y: '69%' },
                  ].map((db, i) => (
                    <div key={i} className="absolute left-[5%] flex items-center gap-2 group/db" style={{ top: db.y }}>
                      <div className="w-9 h-9 rounded-lg bg-[#0A0F0D] border border-[#52B788]/15 flex items-center justify-center transition-shadow duration-300 group-hover/db:shadow-[0_0_14px_rgba(82,183,136,0.3)]">
                        <Database size={16} className="text-[#52B788]/60 transition-colors duration-300 group-hover/db:text-[#52B788]" />
                      </div>
                      <span className="text-[0.65rem] font-[var(--font-outfit)] text-[#5A7A58]">{db.label}</span>
                    </div>
                  ))}

                  {/* baseil in the center */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group/baseil">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#52B788]/10 to-[#40916C]/10 border border-[#52B788]/20 flex items-center justify-center baseil-center-glow transition-shadow duration-500 group-hover/baseil:shadow-[0_0_50px_rgba(82,183,136,0.3),0_0_100px_rgba(82,183,136,0.12)]">
                      <Leaf size={24} className="text-[#52B788] transition-transform duration-500 group-hover/baseil:scale-110" />
                    </div>
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[0.6rem] font-[var(--font-outfit)] text-[#52B788]/50 whitespace-nowrap">baseil</span>
                  </div>

                  {/* Consumers on the right */}
                  {[
                    { label: 'Humans', y: '15%' },
                    { label: 'Agents', y: '42%' },
                    { label: 'Apps', y: '69%' },
                  ].map((c, i) => (
                    <div key={i} className="absolute right-[5%] flex items-center gap-2 flex-row-reverse group/consumer" style={{ top: c.y }}>
                      <div className="w-9 h-9 rounded-lg bg-[#0A0F0D] border border-[#52B788]/15 flex items-center justify-center transition-shadow duration-300 group-hover/consumer:shadow-[0_0_14px_rgba(82,183,136,0.3)]">
                        <Bot size={16} className="text-[#52B788]/60 transition-colors duration-300 group-hover/consumer:text-[#52B788]" />
                      </div>
                      <span className="text-[0.65rem] font-[var(--font-outfit)] text-[#5A7A58]">{c.label}</span>
                    </div>
                  ))}

                  {/* Clean flow lines — thicker with glow */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 200">
                    <defs>
                      <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Glow underlayer lines (thicker, blurred) */}
                    {[40, 92, 144].map((y, i) => (
                      <line key={`lg${i}`} x1="100" y1={y} x2="270" y2="100" stroke="rgba(82,183,136,0.08)" strokeWidth="4" filter="url(#line-glow)" />
                    ))}
                    {[40, 92, 144].map((y, i) => (
                      <line key={`rg${i}`} x1="330" y1="100" x2="500" y2={y} stroke="rgba(82,183,136,0.06)" strokeWidth="4" filter="url(#line-glow)" />
                    ))}

                    {/* Crisp main lines */}
                    {[40, 92, 144].map((y, i) => (
                      <line key={`l${i}`} x1="100" y1={y} x2="270" y2="100" stroke="rgba(82,183,136,0.2)" strokeWidth="1.5" />
                    ))}
                    {[40, 92, 144].map((y, i) => (
                      <line key={`r${i}`} x1="330" y1="100" x2="500" y2={y} stroke="rgba(82,183,136,0.16)" strokeWidth="1.5" />
                    ))}

                    {/* Animated data dots — left to center */}
                    {[0, 1, 2].map(i => (
                      <circle key={`dl${i}`} r="2.5" fill="#52B788" opacity="0.6">
                        <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite">
                          <mpath href={`#baseil-flow-left-${i}`} />
                        </animateMotion>
                      </circle>
                    ))}
                    {/* Animated data dots — center to right */}
                    {[0, 1, 2].map(i => (
                      <circle key={`dr${i}`} r="2.5" fill="#6FCF97" opacity="0.5">
                        <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite">
                          <mpath href={`#baseil-flow-right-${i}`} />
                        </animateMotion>
                      </circle>
                    ))}

                    {/* Hidden motion paths */}
                    {[40, 92, 144].map((y, i) => (
                      <path key={`pl${i}`} id={`baseil-flow-left-${i}`} d={`M100 ${y} L270 100`} fill="none" />
                    ))}
                    {[40, 92, 144].map((y, i) => (
                      <path key={`pr${i}`} id={`baseil-flow-right-${i}`} d={`M330 100 L500 ${y}`} fill="none" />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
