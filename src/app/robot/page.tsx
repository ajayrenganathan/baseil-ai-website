'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ═══════════════════════════════════════════════════════════════════════
   Particle system — ambient fireflies/pollen
   ═══════════════════════════════════════════════════════════════════════ */
function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Array<{
      x: number; y: number; vx: number; vy: number
      size: number; opacity: number; phase: number; speed: number
      hue: number
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.2 - 0.1,
        size: Math.random() * 2.5 + 0.8,
        opacity: Math.random() * 0.5 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.004,
        hue: [80, 100, 140, 55, 160][Math.floor(Math.random() * 5)],
      })
    }

    let time = 0
    const animate = () => {
      time++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx + Math.sin(time * p.speed) * 0.25
        p.y += p.vy + Math.cos(time * p.speed * 0.7) * 0.15
        const flicker = Math.sin(time * p.speed * 3 + p.phase) * 0.35 + 0.65

        if (p.x < -20) p.x = canvas.width + 20
        if (p.x > canvas.width + 20) p.x = -20
        if (p.y < -20) p.y = canvas.height + 20
        if (p.y > canvas.height + 20) p.y = -20

        const alpha = p.opacity * flicker
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5)
        grad.addColorStop(0, `hsla(${p.hue}, 70%, 75%, ${alpha})`)
        grad.addColorStop(0.3, `hsla(${p.hue}, 60%, 65%, ${alpha * 0.3})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `hsla(${p.hue}, 80%, 90%, ${alpha * 0.9})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [canvasRef])
}

/* ═══════════════════════════════════════════════════════════════════════
   Main page
   ═══════════════════════════════════════════════════════════════════════ */
export default function RobotPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [isBlinking, setIsBlinking] = useState(false)
  const [isJumping, setIsJumping] = useState(false)
  const [showRobot, setShowRobot] = useState(false)

  useParticles(canvasRef)

  // Entrance
  useEffect(() => {
    const t = setTimeout(() => setShowRobot(true), 200)
    return () => clearTimeout(t)
  }, [])

  // Blink cycle
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const scheduleBlink = () => {
      const delay = 2200 + Math.random() * 2500
      timeout = setTimeout(() => {
        setIsBlinking(true)
        setTimeout(() => {
          setIsBlinking(false)
          // Occasional double-blink
          if (Math.random() > 0.65) {
            setTimeout(() => {
              setIsBlinking(true)
              setTimeout(() => setIsBlinking(false), 130)
            }, 250)
          }
        }, 140)
        scheduleBlink()
      }, delay)
    }
    scheduleBlink()
    return () => clearTimeout(timeout)
  }, [])

  // Mouse
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // Click jump
  const handleClick = useCallback(() => {
    if (isJumping) return
    setIsJumping(true)
    setTimeout(() => setIsJumping(false), 700)
  }, [isJumping])

  // Cursor-reactive eye offset
  const eyeX = (mousePos.x - 0.5) * 5
  const eyeY = (mousePos.y - 0.5) * 3.5
  // Subtle body tilt
  const tiltY = (mousePos.x - 0.5) * 2.5
  const tiltX = (mousePos.y - 0.5) * -1.5

  return (
    <div className="robot-scene" onClick={handleClick}>
      {/* ── Background ── */}
      <div className="bg-base" />
      <div className="bg-orbs" />
      <div className="bg-vignette" />

      {/* ── Particles ── */}
      <canvas ref={canvasRef} className="particle-canvas" />

      {/* ── Ambient glow behind robot ── */}
      <div className="ambient-glow" />

      {/* ── Ground ── */}
      <div className="ground">
        <div className="ground-fill" />
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="grass"
            style={{
              left: `${3 + i * 5 + Math.sin(i * 1.8) * 1.5}%`,
              height: `${14 + Math.sin(i * 2.5) * 10}px`,
              animationDelay: `${i * 0.17}s`,
              opacity: 0.3 + Math.sin(i) * 0.2 + 0.2,
            }}
          />
        ))}
      </div>

      {/* ── Robot ── */}
      <div
        className={`robot-root ${showRobot ? 'entered' : ''} ${isJumping ? 'jump' : ''}`}
        style={{
          transform: `perspective(900px) rotateY(${tiltY}deg) rotateX(${tiltX}deg)`,
        }}
      >
        {/* Shadow */}
        <div className={`shadow ${isJumping ? 'shadow-jump' : ''}`} />

        {/* Body — the idle bob lives here so leaf inherits it */}
        <div className="body-bob">
          {/* Robot image */}
          <div className="robot-img-wrap">
            <img
              src="/robot/robot-front-full.png"
              alt="Sprout Robot"
              className="robot-img"
              draggable={false}
            />

            {/* Eye shine tracking */}
            <div
              className="eye-track"
              style={{ transform: `translate(${eyeX}px, ${eyeY}px)` }}
            >
              <div className="shine shine-l" />
              <div className="shine shine-r" />
            </div>

            {/* Blink */}
            {isBlinking && (
              <>
                <div className="lid lid-l" />
                <div className="lid lid-r" />
              </>
            )}

            {/* Chest amber glow */}
            <div className="chest-glow" />
          </div>

          {/* Leaf — child of body-bob so it floats with robot, plus own sway */}
          <div className="leaf-wrap">
            <img
              src="/robot/robot-leaf.png"
              alt=""
              className="leaf-img"
              draggable={false}
            />
          </div>
        </div>
      </div>

      <style>{`
        /* ━━━ SCENE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        .robot-scene {
          position: fixed;
          inset: 0;
          overflow: hidden;
          cursor: pointer;
          user-select: none;
        }

        .bg-base {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 130% 90% at 50% 35%,
            #172a1e 0%, #0e1a12 35%, #070e09 70%, #040804 100%);
        }

        .bg-orbs {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle 280px at 18% 25%, rgba(90, 170, 70, 0.06), transparent 70%),
            radial-gradient(circle 220px at 82% 55%, rgba(70, 150, 130, 0.05), transparent 70%),
            radial-gradient(circle 350px at 50% 75%, rgba(55, 115, 75, 0.04), transparent 70%),
            radial-gradient(circle 180px at 72% 15%, rgba(130, 170, 55, 0.035), transparent 70%);
        }

        .bg-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 65% 55% at 50% 48%, transparent, rgba(3, 6, 4, 0.8) 100%);
        }

        .particle-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }

        .ambient-glow {
          position: absolute;
          left: 50%;
          bottom: 22vh;
          width: 420px;
          height: 420px;
          transform: translateX(-50%);
          background: radial-gradient(circle,
            rgba(75, 175, 110, 0.1) 0%,
            rgba(60, 140, 95, 0.04) 45%,
            transparent 70%);
          pointer-events: none;
          z-index: 1;
          animation: amb-pulse 5s ease-in-out infinite;
        }

        @keyframes amb-pulse {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.08); }
        }

        /* ━━━ GROUND ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        .ground {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 18vh;
          z-index: 3;
        }

        .ground-fill {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 7vh;
          background: linear-gradient(to top, #080f0a, #0c1710 50%, transparent);
        }

        .grass {
          position: absolute;
          bottom: 6vh;
          width: 2.5px;
          background: linear-gradient(to top, #1e4a2a, #3d7a4a);
          border-radius: 1.5px 1.5px 0 0;
          transform-origin: bottom center;
          animation: sway 3.2s ease-in-out infinite;
        }

        @keyframes sway {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }

        /* ━━━ ROBOT ROOT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        .robot-root {
          position: absolute;
          left: 50%;
          bottom: 11vh;
          z-index: 10;
          transform-style: preserve-3d;
          transition: transform 0.25s ease-out;

          /* Entrance */
          opacity: 0;
          filter: blur(8px);
          translate: 0 30px;
        }

        .robot-root.entered {
          opacity: 1;
          filter: blur(0px);
          translate: 0 0;
          transition:
            opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
            filter 0.9s cubic-bezier(0.16, 1, 0.3, 1),
            translate 0.9s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.25s ease-out;
        }

        /* ━━━ SHADOW ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        .shadow {
          position: absolute;
          bottom: -5px;
          left: 50%;
          width: 150px;
          height: 18px;
          margin-left: -75px;
          background: radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: shadow-idle 3s ease-in-out infinite;
        }

        .shadow-jump {
          animation: shadow-jmp 0.7s ease-out !important;
        }

        @keyframes shadow-idle {
          0%, 100% { transform: scaleX(1); opacity: 0.65; }
          50% { transform: scaleX(1.08) scaleY(0.9); opacity: 0.45; }
        }

        @keyframes shadow-jmp {
          0%   { transform: scaleX(1); opacity: 0.6; }
          25%  { transform: scaleX(0.5) scaleY(0.4); opacity: 0.25; }
          55%  { transform: scaleX(0.55); opacity: 0.3; }
          80%  { transform: scaleX(1.15) scaleY(1.1); opacity: 0.7; }
          100% { transform: scaleX(1); opacity: 0.6; }
        }

        /* ━━━ BODY BOB ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        .body-bob {
          position: relative;
          animation: idle 3s ease-in-out infinite;
        }

        .jump .body-bob {
          animation: jmp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }

        @keyframes idle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          30%  { transform: translateY(-9px) rotate(0.4deg); }
          50%  { transform: translateY(-13px) rotate(0deg); }
          70%  { transform: translateY(-7px) rotate(-0.4deg); }
        }

        @keyframes jmp {
          0%   { transform: translateY(0) scaleX(1) scaleY(1); }
          12%  { transform: translateY(6px) scaleX(1.07) scaleY(0.93); }
          35%  { transform: translateY(-70px) scaleX(0.94) scaleY(1.06); }
          52%  { transform: translateY(-68px) scaleX(0.95) scaleY(1.04); }
          75%  { transform: translateY(4px) scaleX(1.05) scaleY(0.95); }
          88%  { transform: translateY(-2px) scaleX(0.99) scaleY(1.01); }
          100% { transform: translateY(0) scaleX(1) scaleY(1); }
        }

        /* ━━━ ROBOT IMAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        .robot-img-wrap {
          position: relative;
          width: 280px;
          margin-left: -140px;
        }

        .robot-img {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 8px 24px rgba(60, 150, 100, 0.15));
        }

        /* ━━━ EYE SHINE (cursor-tracking glints) ━━━━━ */
        .eye-track {
          position: absolute;
          inset: 0;
          pointer-events: none;
          transition: transform 0.12s ease-out;
        }

        .shine {
          position: absolute;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: radial-gradient(circle,
            rgba(255,255,255,0.95) 0%,
            rgba(255,255,255,0.5) 40%,
            transparent 70%);
          filter: blur(0.3px);
        }

        /* Percentages relative to .robot-img-wrap (280 × ~494) */
        .shine-l { top: 31.5%; left: 31.5%; }
        .shine-r { top: 31.5%; left: 60.5%; }

        /* ━━━ EYELIDS (blink) ━━━━━━━━━━━━━━━━━━━━━━━━ */
        .lid {
          position: absolute;
          width: 50px;
          height: 44px;
          border-radius: 50%;
          pointer-events: none;
          animation: blink 0.14s ease-in-out;
        }

        .lid-l {
          top: 27.5%;
          left: 22%;
          background: radial-gradient(ellipse at 50% 55%, #8cc5cc 0%, #7ab5bf 60%, #6eaab3 100%);
        }

        .lid-r {
          top: 27.5%;
          left: 49%;
          background: radial-gradient(ellipse at 50% 55%, #8cc5cc 0%, #7ab5bf 60%, #6eaab3 100%);
        }

        @keyframes blink {
          0%   { transform: scaleY(0); }
          45%  { transform: scaleY(1); }
          100% { transform: scaleY(0); }
        }

        /* ━━━ CHEST GLOW ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        .chest-glow {
          position: absolute;
          top: 56%;
          left: 45.8%;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(circle,
            rgba(255, 175, 50, 0.7) 0%,
            rgba(255, 140, 30, 0.25) 50%,
            transparent 72%);
          pointer-events: none;
          animation: chest 2.2s ease-in-out infinite;
        }

        @keyframes chest {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        /* ━━━ LEAF ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        .leaf-wrap {
          position: absolute;
          z-index: 11;
          pointer-events: none;
          /*
            Leaf image: 200px wide × ~136px tall.
            Stem base should land at (140px, 54px) relative to robot-img-wrap top-left.
            leaf-wrap origin is its own top-left.
            stem is at bottom-center of leaf image = (100, 136).
            So: left = 140 - 100 = 40,  relative to robot-img-wrap.
            But robot-img-wrap starts at margin-left: -140px from robot-root center.
            leaf-wrap is sibling to robot-img-wrap inside body-bob.
            body-bob starts at the same origin as robot-root.
            So leaf-wrap left = -140 + 40 = -100px from body-bob left.
            top = 54 - 136 = -82px from body-bob top (same as robot-img-wrap top).
          */
          top: -78px;
          left: -100px;
          width: 200px;
          transform-origin: 50% 100%;
          animation: leaf-sway 2.8s ease-in-out infinite;
        }

        .leaf-img {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 2px 10px rgba(80, 170, 70, 0.2));
        }

        @keyframes leaf-sway {
          0%   { transform: rotate(-3deg); }
          25%  { transform: rotate(4.5deg) translateX(1.5px); }
          50%  { transform: rotate(-1.5deg) translateX(-0.5px); }
          75%  { transform: rotate(3.5deg) translateX(1px); }
          100% { transform: rotate(-3deg); }
        }

        /* ━━━ RESPONSIVE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        @media (max-width: 640px) {
          .robot-img-wrap { width: 210px; margin-left: -105px; }
          .shadow { width: 110px; margin-left: -55px; }
          .lid { width: 38px; height: 33px; }
          .shine { width: 8px; height: 8px; }
          .chest-glow { width: 15px; height: 15px; }
          .leaf-wrap { width: 150px; top: -58px; left: -75px; }
          .ambient-glow { width: 300px; height: 300px; }
        }
      `}</style>
    </div>
  )
}
