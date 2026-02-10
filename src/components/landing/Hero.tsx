'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Database, Clock, TableIcon } from 'lucide-react'

const DEMO_RESULT = {
  columns: ['Customer', 'Revenue', 'Orders', 'Region'],
  rows: [
    ['Meridian Corp', '$284,320', '142', 'NA'],
    ['Apex Industries', '$231,500', '98', 'EU'],
    ['NovaTech Ltd', '$198,740', '87', 'APAC'],
    ['Stratos Group', '$176,200', '76', 'NA'],
  ],
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => { setLoaded(true) }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; type: 'dot' | 'node'
    }> = []

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: Math.random() * 0.15 + 0.05,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.03,
        type: Math.random() > 0.88 ? 'node' : 'dot',
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1

        if (p.type === 'node') {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(82, 183, 136, ${p.opacity * 0.4})`
          ctx.fill()
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(82, 183, 136, ${p.opacity * 0.08})`
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(82, 183, 136, ${p.opacity})`
          ctx.fill()
        }
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 z-[1]">
        <div className="absolute top-[15%] right-[15%] w-[600px] h-[600px] bg-[radial-gradient(ellipse,_rgba(82,183,136,0.05)_0%,_transparent_65%)]" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-[radial-gradient(ellipse,_rgba(64,145,108,0.04)_0%,_transparent_65%)]" />
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto px-6 w-full text-center pt-28 md:pt-32">
        {/* Badge */}
        <div className={`transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center gap-2.5 mb-8 px-4 py-1.5 rounded-full border border-[#52B788]/15 bg-[#52B788]/[0.04]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#52B788] animate-pulse" />
            <span className="text-[0.72rem] font-[var(--font-outfit)] text-[#52B788]/70 tracking-wide">
              Early Access
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className={`font-[var(--font-newsreader)] text-[clamp(2.4rem,5.5vw,3.8rem)] leading-[1.12] text-[#EDF5EB] mb-5 transition-all duration-1000 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          One Intelligent Layer<br />
          <span className="italic text-[#52B788]">Uniting All Your Data.</span>
        </h1>

        {/* Subtitle */}
        <p className={`font-[var(--font-outfit)] text-[0.95rem] leading-relaxed text-[#8FAF8A] max-w-[520px] mx-auto mb-10 transition-all duration-700 delay-600 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          An autonomous agent layer that discovers your schemas, routes queries across databases, and gets smarter with every interaction.
        </p>

        {/* CTAs */}
        <div className={`flex items-center justify-center gap-4 mb-16 transition-all duration-700 delay-[800ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <button
            onClick={() => scrollTo('early-access')}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[0.9rem] font-[var(--font-outfit)] font-medium text-[#0A0F0D] bg-gradient-to-r from-[#52B788] to-[#40916C] border border-[#52B788]/40 shadow-[0_0_24px_rgba(82,183,136,0.2)] hover:shadow-[0_0_32px_rgba(82,183,136,0.3)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            Request Access
            <ArrowRight size={15} />
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[0.9rem] font-[var(--font-outfit)] font-medium text-[#C8D8C4] bg-[#52B788]/[0.06] border border-[#52B788]/20 hover:bg-[#52B788]/[0.1] hover:border-[#52B788]/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            How it works
          </button>
        </div>

        {/* Demo card */}
        <div className={`max-w-[600px] mx-auto transition-all duration-1000 delay-[1000ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="rounded-2xl border border-[#52B788]/10 bg-[#0A0F0D] overflow-hidden shadow-2xl shadow-black/40">
            {/* Terminal bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#52B788]/[0.06] bg-[#0D1410]/60">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#52B788]/[0.05] border border-[#52B788]/10">
                  <Database size={10} className="text-[#52B788]/50" />
                  <span className="text-[0.6rem] font-[var(--font-outfit)] text-[#52B788]/60">e-commerce.db</span>
                  <div className="w-1 h-1 rounded-full bg-[#52B788]/70" />
                </div>
              </div>
              <span className="text-[0.55rem] font-[var(--font-outfit)] text-[#3D5A3A]">baseil</span>
            </div>

            {/* Query */}
            <div className="px-4 py-3 border-b border-[#52B788]/[0.04]">
              <div className="flex items-center gap-2">
                <span className="text-[#52B788]/30 font-[var(--font-outfit)] text-sm select-none">&gt;</span>
                <span className="text-sm font-[var(--font-outfit)] text-[#C8D8C4]">
                  Top customers by revenue this quarter
                </span>
                <span className="w-[2px] h-3.5 bg-[#52B788]/50 animate-pulse ml-0.5" />
              </div>
            </div>

            {/* Results */}
            <div className="p-4">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    {DEMO_RESULT.columns.map((col, i) => (
                      <th key={i} className="text-[0.6rem] font-[var(--font-outfit)] font-normal text-[#5A7A58] uppercase tracking-wider pb-2 pr-4">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEMO_RESULT.rows.map((row, i) => (
                    <tr key={i} className="border-t border-[#52B788]/[0.04]">
                      {row.map((cell, j) => (
                        <td key={j} className={`py-1.5 pr-4 text-[0.75rem] font-[var(--font-outfit)] ${j === 0 ? 'text-[#C8D8C4]' : 'text-[#8FAF8A]'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center gap-4 mt-3 pt-2 border-t border-[#52B788]/[0.04]">
                <span className="flex items-center gap-1 text-[0.58rem] font-[var(--font-outfit)] text-[#3D5A3A]">
                  <Clock size={9} /> 340ms
                </span>
                <span className="flex items-center gap-1 text-[0.58rem] font-[var(--font-outfit)] text-[#3D5A3A]">
                  <TableIcon size={9} /> 4 rows
                </span>
                <span className="text-[0.58rem] font-[var(--font-outfit)] text-[#3D5A3A]">PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust line */}
        <div className={`flex items-center justify-center gap-6 mt-12 pb-16 text-[0.7rem] font-[var(--font-outfit)] text-[#3D5A3A] transition-all duration-700 delay-[1200ms] ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <span>Open Source</span>
          <span className="w-px h-3 bg-[#52B788]/15" />
          <span>Self-host</span>
          <span className="w-px h-3 bg-[#52B788]/15" />
          <span>Agent-native</span>
        </div>
      </div>
    </section>
  )
}
