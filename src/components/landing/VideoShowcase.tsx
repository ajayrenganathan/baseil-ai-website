'use client'

import { useState, useRef, useEffect } from 'react'
import { Play } from 'lucide-react'

export function VideoShowcase() {
  const [playing, setPlaying] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="video" ref={sectionRef} className="relative py-28 overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6">
        {/* Section label */}
        <div className="text-center mb-14">
          <span className="text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/50 mb-4 block">
            See it in action
          </span>
          <h2 className="font-[var(--font-newsreader)] text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#C8D8C4] leading-tight">
            From connection to first query<br />in under five minutes.
          </h2>
        </div>

        {/* Video container */}
        <div
          className={`relative rounded-2xl overflow-hidden border border-[#52B788]/8 bg-[#111916] transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Glow effect */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-[#52B788]/8 via-transparent to-[#52B788]/5 -z-10 blur-sm" />

          {/* Video placeholder / thumbnail */}
          <div className="relative aspect-video bg-gradient-to-br from-[#0D1410] to-[#0A0F0D] flex items-center justify-center">
            {/* Simulated product UI */}
            <div className="absolute inset-6 rounded-lg border border-[#52B788]/[0.06] overflow-hidden">
              {/* Fake sidebar */}
              <div className="absolute left-0 top-0 bottom-0 w-[180px] bg-[#52B788]/[0.02] border-r border-[#52B788]/[0.06]">
                {[72, 85, 64, 91, 78, 68, 88].map((w, i) => (
                  <div key={i} className="mx-4 my-3 h-2 rounded-full bg-[#52B788]/[0.06]" style={{ width: `${w}%` }} />
                ))}
              </div>
              {/* Fake main content */}
              <div className="absolute left-[180px] top-0 right-0 bottom-0 p-6">
                <div className="h-3 w-32 rounded bg-[#52B788]/[0.08] mb-4" />
                <div className="h-2 w-48 rounded bg-[#52B788]/[0.04] mb-6" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-2 rounded bg-[#52B788]/[0.04] flex-1" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Play button */}
            {!playing && (
              <button
                onClick={() => setPlaying(true)}
                className="relative z-10 group"
              >
                <div className="w-20 h-20 rounded-full border-2 border-[#52B788]/25 bg-[#52B788]/[0.06] flex items-center justify-center group-hover:bg-[#52B788]/12 group-hover:border-[#52B788]/40 group-hover:scale-110 transition-all duration-500">
                  <Play size={28} className="text-[#52B788] ml-1" />
                </div>
                <div className="absolute inset-0 rounded-full border border-[#52B788]/10 animate-ping" style={{ animationDuration: '2s' }} />
              </button>
            )}

            {/* Shimmer overlay */}
            {!playing && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#52B788]/[0.02] to-transparent baseil-shimmer-slide" />
            )}
          </div>
        </div>

        {/* Caption */}
        <p className="text-center mt-6 text-[0.8rem] font-[var(--font-outfit)] text-[#3D5A3A]">
          Connect a database &middot; Auto-discover schemas &middot; Query in natural language &middot; Get results
        </p>
      </div>
    </section>
  )
}
