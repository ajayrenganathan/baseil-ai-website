'use client'

import { useEffect, useRef, useState } from 'react'
import { User, Bot } from 'lucide-react'
import { HeroShowcase } from './showcase/HeroShowcase'

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

  return (
    <section className="relative min-h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 z-[1]">
        <div className="absolute top-[15%] right-[15%] w-[600px] h-[600px] bg-[radial-gradient(ellipse,_rgba(82,183,136,0.05)_0%,_transparent_65%)]" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-[radial-gradient(ellipse,_rgba(64,145,108,0.04)_0%,_transparent_65%)]" />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-6 w-full text-center pt-36 md:pt-44">
        {/* Headline */}
        <h1 className={`font-[var(--font-newsreader)] text-[clamp(2.6rem,6vw,4rem)] leading-[1.1] text-[#EDF5EB] mb-5 transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          One intelligent layer.<br />
          <span className="italic text-[#52B788]">All your data.</span>
        </h1>

        {/* Subtitle */}
        <p className={`font-[var(--font-outfit)] text-[0.9rem] leading-relaxed text-[#8FAF8A] max-w-[500px] mx-auto mb-4 transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          An autonomous agent layer that discovers your schemas, routes queries across databases, and gets smarter with every interaction.
        </p>

        {/* Audience chips */}
        <div className={`flex items-center justify-center gap-2.5 mb-12 transition-all duration-700 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#52B788]/12 bg-[#52B788]/[0.04]">
            <User size={13} className="text-[#52B788]/50" />
            <span className="text-[0.72rem] font-[var(--font-outfit)] text-[#8FAF8A]">Humans</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#52B788]/12 bg-[#52B788]/[0.04]">
            <Bot size={13} className="text-[#52B788]/50" />
            <span className="text-[0.72rem] font-[var(--font-outfit)] text-[#8FAF8A]">Agents</span>
          </div>
        </div>

        {/* Animated showcase — break out of px-6 to match /showcase page */}
        <div className={`-mx-6 px-0 text-left transition-all duration-1000 delay-[1000ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <HeroShowcase />
        </div>

        {/* Trust line */}
        <div className={`flex items-center justify-center gap-5 mt-6 pb-10 text-[0.68rem] font-[var(--font-outfit)] text-[#3D5A3A] transition-all duration-700 delay-[1200ms] ${loaded ? 'opacity-100' : 'opacity-0'}`}>
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
