'use client'

import { useEffect, useRef } from 'react'
import { ArrowDown } from 'lucide-react'

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; hue: number
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles representing calm data flow
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: Math.random() * 0.2 + 0.1,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.05,
        hue: Math.random() > 0.7 ? 174 : 210, // teal or blue
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.opacity})`
        ctx.fill()
      })

      // Draw faint connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `hsla(190, 60%, 50%, ${0.04 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Radial gradient overlays for depth */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,_rgba(14,230,212,0.06)_0%,_transparent_70%)]" />
        <div className="absolute bottom-[10%] left-[30%] w-[500px] h-[400px] bg-[radial-gradient(ellipse,_rgba(59,130,246,0.04)_0%,_transparent_70%)]" />
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none landing-grain" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-[900px] mx-auto px-6">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-[#0ee6d4]/20 bg-[#0ee6d4]/[0.04]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#0ee6d4] animate-pulse" />
          <span className="text-[0.75rem] font-[var(--font-dm-sans)] text-[#0ee6d4]/80 tracking-wide uppercase">
            Open Source &middot; Now in Early Access
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-[var(--font-instrument-serif)] text-[clamp(2.8rem,6.5vw,5.5rem)] leading-[1.05] text-[#e8e6e3] mb-6 tracking-[-0.02em]">
          Intelligent data retrieval.
          <br />
          <span className="landing-text-shimmer">Zero friction.</span>
        </h1>

        {/* Supporting copy */}
        <p className="font-[var(--font-dm-sans)] text-[clamp(1rem,1.8vw,1.2rem)] leading-relaxed text-[#8a8a9a] max-w-[600px] mx-auto mb-10">
          dbzero connects to your databases, understands their structure, and figures out where your data lives from a simple question. Built for humans, agents, and apps.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => scrollTo('early-access')}
            className="landing-cta-primary text-[0.95rem] px-8 py-3.5"
          >
            Request Early Access
          </button>
          <button
            onClick={() => scrollTo('sandbox')}
            className="landing-cta-ghost text-[0.95rem] px-8 py-3.5"
          >
            Try Live Demo
          </button>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 text-[0.75rem] font-[var(--font-dm-sans)] text-[#5a5a6a]">
          <span>Open Source</span>
          <span className="w-px h-3 bg-[#2a2a3a]" />
          <span>Self-host or Managed</span>
          <span className="w-px h-3 bg-[#2a2a3a]" />
          <span>Agent-native</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo('problem')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-[#4a4a5a] hover:text-[#0ee6d4] transition-colors duration-500 animate-bounce"
      >
        <ArrowDown size={20} />
      </button>
    </section>
  )
}
