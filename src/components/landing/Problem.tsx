'use client'

import { useEffect, useRef, useState } from 'react'
import { Database, Bot, AlertTriangle, Zap } from 'lucide-react'

export function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [resolved, setResolved] = useState(false)

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

  return (
    <section id="problem" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#0ee6d4]/20 to-transparent" />

      <div className="max-w-[1100px] mx-auto px-6">
        {/* Section label */}
        <div className="text-center mb-16">
          <span className="text-[0.7rem] font-[var(--font-dm-sans)] uppercase tracking-[0.2em] text-[#0ee6d4]/60 mb-4 block">
            The Problem
          </span>
          <h2 className="font-[var(--font-instrument-serif)] text-[clamp(2rem,4vw,3.2rem)] text-[#e8e6e3] leading-tight">
            The bottleneck is already here.
          </h2>
        </div>

        {/* Before / After visual */}
        <div className="relative max-w-[800px] mx-auto">
          {/* BEFORE state - chaos */}
          <div className={`transition-all duration-1000 ${resolved ? 'opacity-0 scale-95 absolute inset-0' : 'opacity-100 scale-100'}`}>
            <div className="relative bg-[#0a0a14]/60 border border-[#1a1a2e] rounded-2xl p-10 overflow-hidden">
              {/* Noise grain */}
              <div className="absolute inset-0 landing-grain opacity-[0.02]" />

              {/* Central stressed agent */}
              <div className="flex flex-col items-center gap-8">
                <p className="font-[var(--font-dm-sans)] text-[1rem] text-[#6a6a7a] text-center max-w-[500px] leading-relaxed">
                  Today&apos;s agents wear too many hats. Understanding users, hunting across databases, formulating queries, formatting responses. Every new data source increases hallucinations.
                </p>

                <div className="relative w-full max-w-[600px] h-[200px]">
                  {/* Database icons scattered around */}
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
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-lg bg-[#1a1a2e] border border-red-500/20 flex items-center justify-center">
                          <db.icon size={18} className="text-red-400/60" />
                        </div>
                        <span className="text-[0.65rem] font-[var(--font-dm-sans)] text-[#4a4a5a]">{db.label}</span>
                      </div>
                    </div>
                  ))}

                  {/* Central overwhelmed agent */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-14 h-14 rounded-xl bg-[#1a1a2e] border border-amber-500/30 flex items-center justify-center ${visible ? 'animate-pulse' : ''}`}>
                      <Bot size={24} className="text-amber-400/70" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <AlertTriangle size={14} className="text-red-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Tangled lines (SVG) */}
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
                        stroke="rgba(239, 68, 68, 0.15)"
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

          {/* AFTER state - calm */}
          <div className={`transition-all duration-1000 delay-200 ${resolved ? 'opacity-100 scale-100' : 'opacity-0 scale-105 absolute inset-0 pointer-events-none'}`}>
            <div className="relative bg-[#0a0a14]/60 border border-[#0ee6d4]/10 rounded-2xl p-10 overflow-hidden">
              <div className="absolute inset-0 landing-grain opacity-[0.02]" />

              <div className="flex flex-col items-center gap-8">
                <p className="font-[var(--font-dm-sans)] text-[1rem] text-[#8a8a9a] text-center max-w-[500px] leading-relaxed">
                  Intelligence at the data layer itself. One calm layer that deciphers what data you need and where it lives.
                </p>

                <div className="relative w-full max-w-[600px] h-[200px]">
                  {/* Databases on the left */}
                  {[
                    { label: 'PostgreSQL', y: '15%' },
                    { label: 'MySQL', y: '42%' },
                    { label: 'MongoDB', y: '69%' },
                  ].map((db, i) => (
                    <div key={i} className="absolute left-[5%] flex items-center gap-2" style={{ top: db.y }}>
                      <div className="w-9 h-9 rounded-lg bg-[#0a1628] border border-[#0ee6d4]/20 flex items-center justify-center">
                        <Database size={16} className="text-[#0ee6d4]/60" />
                      </div>
                      <span className="text-[0.65rem] font-[var(--font-dm-sans)] text-[#4a5a6a]">{db.label}</span>
                    </div>
                  ))}

                  {/* dbzero in the center */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0ee6d4]/10 to-[#3b82f6]/10 border border-[#0ee6d4]/20 flex items-center justify-center landing-dam-glow">
                      <Zap size={24} className="text-[#0ee6d4]" />
                    </div>
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[0.6rem] font-[var(--font-dm-sans)] text-[#0ee6d4]/60 whitespace-nowrap">dbzero</span>
                  </div>

                  {/* Consumers on the right */}
                  {[
                    { label: 'Humans', y: '15%' },
                    { label: 'Agents', y: '42%' },
                    { label: 'Apps', y: '69%' },
                  ].map((c, i) => (
                    <div key={i} className="absolute right-[5%] flex items-center gap-2 flex-row-reverse" style={{ top: c.y }}>
                      <div className="w-9 h-9 rounded-lg bg-[#0a1628] border border-[#3b82f6]/20 flex items-center justify-center">
                        <Bot size={16} className="text-[#3b82f6]/60" />
                      </div>
                      <span className="text-[0.65rem] font-[var(--font-dm-sans)] text-[#4a5a6a]">{c.label}</span>
                    </div>
                  ))}

                  {/* Clean flow lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 200">
                    {/* Left to center */}
                    {[40, 92, 144].map((y, i) => (
                      <line key={`l${i}`} x1="100" y1={y} x2="270" y2="100" stroke="rgba(14,230,212,0.15)" strokeWidth="1" />
                    ))}
                    {/* Center to right */}
                    {[40, 92, 144].map((y, i) => (
                      <line key={`r${i}`} x1="330" y1="100" x2="500" y2={y} stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
                    ))}
                    {/* Flowing data dots */}
                    {[0, 1, 2].map(i => (
                      <circle key={`dl${i}`} r="2" fill="#0ee6d4" opacity="0.5">
                        <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite">
                          <mpath href={`#flow-left-${i}`} />
                        </animateMotion>
                      </circle>
                    ))}
                    {[0, 1, 2].map(i => (
                      <circle key={`dr${i}`} r="2" fill="#3b82f6" opacity="0.5">
                        <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite">
                          <mpath href={`#flow-right-${i}`} />
                        </animateMotion>
                      </circle>
                    ))}
                    {/* Motion paths */}
                    {[40, 92, 144].map((y, i) => (
                      <path key={`pl${i}`} id={`flow-left-${i}`} d={`M100 ${y} L270 100`} fill="none" />
                    ))}
                    {[40, 92, 144].map((y, i) => (
                      <path key={`pr${i}`} id={`flow-right-${i}`} d={`M330 100 L500 ${y}`} fill="none" />
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
