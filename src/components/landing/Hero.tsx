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
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; type: 'dot' | 'node'
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles — green data flow dots
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: Math.random() * 0.2 + 0.1,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.05,
        type: Math.random() > 0.85 ? 'node' : 'dot',
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
          // Larger glowing nodes
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(82, 183, 136, ${p.opacity * 0.5})`
          ctx.fill()
          // Glow ring
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(82, 183, 136, ${p.opacity * 0.1})`
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(82, 183, 136, ${p.opacity})`
          ctx.fill()
        }
      })

      // Draw circuit-like lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 140) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            // Create right-angle segments for circuit board feel
            const midX = (particles[i].x + particles[j].x) / 2
            ctx.lineTo(midX, particles[i].y)
            ctx.lineTo(midX, particles[j].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(82, 183, 136, ${0.06 * (1 - dist / 140)})`
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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Circuit canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Radial glows */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute top-[20%] right-[20%] w-[600px] h-[600px] bg-[radial-gradient(ellipse,_rgba(82,183,136,0.07)_0%,_transparent_70%)]" />
        <div className="absolute bottom-[10%] left-[30%] w-[500px] h-[400px] bg-[radial-gradient(ellipse,_rgba(64,145,108,0.05)_0%,_transparent_70%)]" />
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none baseil-grain" />

      {/* Content — centered */}
      <div className="relative z-10 max-w-[900px] mx-auto px-6 w-full text-center">
        <div>
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 mb-8 px-5 py-2 rounded-full border border-[#52B788]/15 bg-[#52B788]/[0.04]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#52B788] animate-pulse" />
            <span className="text-[0.75rem] font-[var(--font-outfit)] text-[#52B788]/70 tracking-wide uppercase">
              Open Source &middot; Now in Early Access
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-[var(--font-newsreader)] text-[clamp(2.8rem,6vw,4.8rem)] leading-[1.08] text-[#EDF5EB] mb-6 tracking-[-0.02em]">
            Your intelligent<br />data layer.
          </h1>

          {/* Subheadline */}
          <h2 className="font-[var(--font-newsreader)] text-[clamp(1.2rem,2.5vw,1.6rem)] leading-[1.3] text-[#C8D8C4] mb-6">
            Between your <strong className="text-[#EDF5EB] font-medium">apps</strong> and your <strong className="text-[#EDF5EB] font-medium">databases</strong>.
          </h2>

          {/* Supporting copy */}
          <p className="font-[var(--font-outfit)] text-[clamp(0.95rem,1.5vw,1.05rem)] leading-relaxed text-[#8FAF8A] max-w-[520px] mx-auto mb-4">
            baseil is an autonomous data agent that discovers, queries, and unifies data across systems — so your applications don&apos;t have to.
          </p>

          <p className="font-[var(--font-outfit)] text-[clamp(0.95rem,1.5vw,1.05rem)] leading-relaxed text-[#8FAF8A] max-w-[520px] mx-auto mb-10">
            Point it at your data. Ask for what you need.<br />
            Baseil figures out the rest.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <button
              onClick={() => scrollTo('early-access')}
              className="baseil-cta-primary text-[0.95rem] px-8 py-3.5"
            >
              Request Early Access
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="baseil-cta-ghost text-[0.95rem] px-8 py-3.5"
            >
              Read the Architecture
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 text-[0.75rem] font-[var(--font-outfit)] text-[#5A7A58]">
            <span>Open Source</span>
            <span className="w-px h-3 bg-[#52B788]/15" />
            <span>Self-host or Managed</span>
            <span className="w-px h-3 bg-[#52B788]/15" />
            <span>Agent-native</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo('problem')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-[#3D5A3A] hover:text-[#52B788] transition-colors duration-500 animate-bounce"
      >
        <ArrowDown size={20} />
      </button>
    </section>
  )
}
