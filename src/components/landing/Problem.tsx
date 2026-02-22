'use client'

import { useEffect, useRef, useState, useCallback, type MouseEvent } from 'react'
import { trackEvent } from '@/lib/analytics'

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────────────────────── */

const SLIDES = [
  {
    id: 'problem',
    label: 'The Problem',
    duration: 3500,
    accent: '#C9672E',
    description:
      "Today\u2019s agents wear too many hats. Understanding users, hunting across databases, formulating queries, formatting responses. Every new data source increases hallucinations.",
  },
  {
    id: 'solution',
    label: 'The Solution',
    duration: 3500,
    accent: '#52B788',
    description:
      'Intelligence at the data layer itself. One calm layer that deciphers what data you need and where it lives.',
  },
  {
    id: 'swarm',
    label: 'The Swarm',
    duration: 3500,
    accent: '#6FCF97',
    description:
      'Deploy as a swarm. Multiple Baseil agents form a mesh. Each owning its own databases, sharing knowledge across your infrastructure.',
  },
] as const

const TRANSITION_MS = 600

/* ─────────────────────────────────────────────────────────────
   TILT UTILITY
   ───────────────────────────────────────────────────────────── */

function getTilt(e: MouseEvent, el: HTMLElement, maxDeg = 2) {
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const nx = (e.clientX - cx) / (rect.width / 2)
  const ny = (e.clientY - cy) / (rect.height / 2)
  return {
    rotateX: -(ny * maxDeg),
    rotateY: nx * maxDeg,
    glowX: ((e.clientX - rect.left) / rect.width) * 100,
    glowY: ((e.clientY - rect.top) / rect.height) * 100,
  }
}

/* ─────────────────────────────────────────────────────────────
   TIMER HOOK — requestAnimationFrame-based auto-advance
   ───────────────────────────────────────────────────────────── */

function useProblemTimer() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const elapsed = useRef(0)
  const lastTime = useRef(0)
  const paused = useRef(false)
  const rafId = useRef(0)

  const advanceSlide = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
      setIsTransitioning(false)
    }, TRANSITION_MS)
    elapsed.current = 0
  }, [])

  const jumpToSlide = useCallback((i: number) => {
    setIsTransitioning(false)
    setCurrentSlide(i)
    elapsed.current = 0
  }, [])

  const pause = useCallback(() => {
    paused.current = true
  }, [])

  const resume = useCallback(() => {
    paused.current = false
    lastTime.current = 0 // reset so next frame doesn't count paused time
  }, [])

  useEffect(() => {
    const tick = (now: number) => {
      if (lastTime.current && !paused.current) {
        elapsed.current += now - lastTime.current
        if (elapsed.current >= SLIDES[0].duration) {
          advanceSlide()
        }
      }
      lastTime.current = now
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [advanceSlide])

  return { currentSlide, isTransitioning, jumpToSlide, pause, resume }
}

/* ─────────────────────────────────────────────────────────────
   SVG ICON HELPERS — pure parametric SVG
   ───────────────────────────────────────────────────────────── */

function IconAPI({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      {/* broadcast arcs */}
      <path d={`M${cx - 6},${cy - 2} A8,8 0 0,1 ${cx + 6},${cy - 2}`} fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
      <path d={`M${cx - 4},${cy + 1} A5,5 0 0,1 ${cx + 4},${cy + 1}`} fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <circle cx={cx} cy={cy + 4} r="2" fill={color} opacity="0.6" />
    </g>
  )
}

function IconSearch({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <circle cx={cx - 1} cy={cy - 1} r="5" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
      <line x1={cx + 3} y1={cy + 3} x2={cx + 6} y2={cy + 6} stroke={color} strokeWidth="1.5" opacity="0.6" />
    </g>
  )
}

function IconDB({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy - 4} rx="7" ry="3" stroke={color} strokeWidth="1" opacity="0.5" fill="none" />
      <line x1={cx - 7} y1={cy - 4} x2={cx - 7} y2={cy + 4} stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1={cx + 7} y1={cy - 4} x2={cx + 7} y2={cy + 4} stroke={color} strokeWidth="1" opacity="0.5" />
      <ellipse cx={cx} cy={cy + 4} rx="7" ry="3" stroke={color} strokeWidth="1" opacity="0.5" fill="none" />
    </g>
  )
}

function IconLeaf({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <path
        d={`M${cx},${cy - 6} Q${cx + 8},${cy - 4} ${cx + 6},${cy + 4} Q${cx},${cy + 2} ${cx - 6},${cy + 4} Q${cx - 8},${cy - 4} ${cx},${cy - 6} Z`}
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
      />
      <line x1={cx} y1={cy - 4} x2={cx} y2={cy + 3} stroke={color} strokeWidth="0.8" opacity="0.5" />
    </g>
  )
}

function SourceIcon({ type, cx, cy, color }: { type: string; cx: number; cy: number; color: string }) {
  switch (type) {
    case 'api':
      return <IconAPI cx={cx} cy={cy} color={color} />
    case 'search':
      return <IconSearch cx={cx} cy={cy} color={color} />
    case 'leaf':
      return <IconLeaf cx={cx} cy={cy} color={color} />
    default:
      return <IconDB cx={cx} cy={cy} color={color} />
  }
}

/* ─────────────────────────────────────────────────────────────
   SLIDE 1 — THE PROBLEM (chaos)
   ───────────────────────────────────────────────────────────── */

function SlideProblem() {
  const sources = [
    { label: 'APIs', type: 'api', x: 55, y: 35 },
    { label: 'Elasticsearch', type: 'search', x: 545, y: 28 },
    { label: 'PostgreSQL', type: 'db', x: 35, y: 180 },
    { label: 'MongoDB', type: 'leaf', x: 555, y: 175 },
    { label: 'Redis', type: 'db', x: 155, y: 18 },
    { label: 'MySQL', type: 'db', x: 445, y: 15 },
    { label: 'S3', type: 'api', x: 140, y: 190 },
    { label: 'Kafka', type: 'api', x: 460, y: 188 },
  ]

  return (
    <svg className="w-full" viewBox="0 0 600 220" fill="none">
      {/* Tangled dashed lines — every source to center */}
      {sources.map((s, i) => (
        <path
          key={`line-${i}`}
          d={`M ${s.x} ${s.y} Q ${300 + (s.x > 300 ? -40 : 40)} ${110 + (s.y > 110 ? -30 : 30)} 300 110`}
          fill="none"
          stroke="rgba(201, 103, 46, 0.13)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
      ))}
      {/* Extra cross-tangles for chaotic feel */}
      <path d="M 55 35 Q 200 180 460 188" fill="none" stroke="rgba(201,103,46,0.07)" strokeWidth="0.8" strokeDasharray="3 8" />
      <path d="M 545 28 Q 400 190 140 190" fill="none" stroke="rgba(201,103,46,0.07)" strokeWidth="0.8" strokeDasharray="3 8" />
      <path d="M 155 18 Q 300 200 555 175" fill="none" stroke="rgba(201,103,46,0.06)" strokeWidth="0.8" strokeDasharray="3 8" />

      {/* Source nodes */}
      {sources.map((s, i) => (
        <g key={i}>
          <rect x={s.x - 16} y={s.y - 16} width="32" height="32" rx="7" fill="#0A0F0D" stroke="rgba(201,103,46,0.2)" strokeWidth="1" />
          <SourceIcon type={s.type} cx={s.x} cy={s.y} color="#C9672E" />
          <text
            x={s.x}
            y={s.y + 26}
            textAnchor="middle"
            fontSize="9"
            fill="#5A7A58"
            fontFamily="var(--font-outfit)"
          >
            {s.label}
          </text>
        </g>
      ))}

      {/* Central overwhelmed bot */}
      <g>
        <rect x="272" y="82" width="56" height="56" rx="14" fill="#0A0F0D" stroke="rgba(245,158,11,0.25)" strokeWidth="1.5" />
        {/* Simple bot face */}
        <rect x="288" y="100" width="5" height="5" rx="1" fill="#F59E0B" opacity="0.7" />
        <rect x="307" y="100" width="5" height="5" rx="1" fill="#F59E0B" opacity="0.7" />
        <rect x="290" y="114" width="20" height="2" rx="1" fill="#F59E0B" opacity="0.4" />
        {/* Pulsing alert triangle */}
        <polygon points="322,78 330,92 314,92" fill="none" stroke="#F59E0B" strokeWidth="1.5">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </polygon>
        <text x="322" y="89" textAnchor="middle" fontSize="9" fill="#F59E0B" fontWeight="bold">!</text>
      </g>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   SLIDE 2 — THE SOLUTION (hub-and-spoke)
   ───────────────────────────────────────────────────────────── */

function SlideSolution() {
  const sourceYs = [35, 85, 140, 195]
  const sources = [
    { label: 'APIs', type: 'api' },
    { label: 'Elasticsearch', type: 'search' },
    { label: 'PostgreSQL', type: 'db' },
    { label: 'MongoDB', type: 'leaf' },
  ]

  return (
    <svg className="w-full" viewBox="0 0 600 220" fill="none">
      <defs>
        <filter id="sol-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Lines: Sources → Baseil */}
      {sourceYs.map((y, i) => (
        <g key={`left-${i}`}>
          <line x1="135" y1={y} x2="265" y2="110" stroke="rgba(82,183,136,0.06)" strokeWidth="4" filter="url(#sol-glow)" />
          <line x1="135" y1={y} x2="265" y2="110" stroke="rgba(82,183,136,0.18)" strokeWidth="1.2" />
          <circle r="2.5" fill="#52B788" opacity="0.6">
            <animateMotion dur={`${2.2 + i * 0.4}s`} repeatCount="indefinite" path={`M135,${y} L265,110`} />
          </circle>
        </g>
      ))}

      {/* Line: Agent → Baseil */}
      <g>
        <line x1="465" y1="65" x2="345" y2="100" stroke="rgba(82,183,136,0.06)" strokeWidth="4" filter="url(#sol-glow)" />
        <line x1="465" y1="65" x2="345" y2="100" stroke="rgba(82,183,136,0.18)" strokeWidth="1.2" />
        <circle r="2.5" fill="#6FCF97" opacity="0.6">
          <animateMotion dur="2.4s" repeatCount="indefinite" path="M465,65 L345,100" />
        </circle>
        {/* Return particle */}
        <circle r="2" fill="#52B788" opacity="0.4">
          <animateMotion dur="2.8s" repeatCount="indefinite" path="M345,100 L465,65" />
        </circle>
      </g>

      {/* Line: Human → Baseil (query) + Baseil → Human (response) */}
      <g>
        <line x1="465" y1="160" x2="345" y2="120" stroke="rgba(82,183,136,0.06)" strokeWidth="4" filter="url(#sol-glow)" />
        <line x1="465" y1="160" x2="345" y2="120" stroke="rgba(82,183,136,0.14)" strokeWidth="1.2" />
        <circle r="2.5" fill="#6FCF97" opacity="0.5">
          <animateMotion dur="2.6s" repeatCount="indefinite" path="M465,160 L345,120" />
        </circle>
        <circle r="2" fill="#52B788" opacity="0.4">
          <animateMotion dur="3s" repeatCount="indefinite" path="M345,120 L465,160" />
        </circle>
      </g>

      {/* Source nodes (left) */}
      {sources.map((s, i) => {
        const y = sourceYs[i]
        return (
          <g key={`src-${i}`}>
            <rect x="60" y={y - 18} width="36" height="36" rx="8" fill="#0A0F0D" stroke="rgba(82,183,136,0.15)" strokeWidth="1" />
            <SourceIcon type={s.type} cx={78} cy={y} color="#52B788" />
            <text x="104" y={y + 4} textAnchor="start" fontSize="10" fill="#5A7A58" fontFamily="var(--font-outfit)">{s.label}</text>
          </g>
        )
      })}

      {/* Baseil center */}
      <g>
        <circle cx="300" cy="110" r="42" fill="none" stroke="rgba(82,183,136,0.06)" strokeWidth="1">
          <animate attributeName="r" values="42;46;42" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.3;1" dur="4s" repeatCount="indefinite" />
        </circle>
        <rect x="268" y="78" width="64" height="64" rx="16" fill="#0A0F0D" stroke="rgba(82,183,136,0.2)" strokeWidth="1.5" />
        <image href="/robot/robot-leaf.png" x="280" y="88" width="40" height="44" />
        <text x="300" y="160" textAnchor="middle" fontSize="11" fill="#52B788" fontFamily="var(--font-outfit)" opacity="0.6">baseil</text>
      </g>

      {/* Agent node (top-right) */}
      <g>
        <rect x="490" y="47" width="40" height="40" rx="10" fill="#0A0F0D" stroke="rgba(82,183,136,0.2)" strokeWidth="1" />
        {/* Bot icon — square eyes + antenna */}
        <line x1="510" y1="50" x2="510" y2="55" stroke="#52B788" strokeWidth="1" opacity="0.5" />
        <circle cx="510" cy="49" r="2" fill="#52B788" opacity="0.5" />
        <rect x="502" y="60" width="5" height="4" rx="1" fill="#52B788" opacity="0.5" />
        <rect x="513" y="60" width="5" height="4" rx="1" fill="#52B788" opacity="0.5" />
        <rect x="504" y="69" width="12" height="2" rx="1" fill="#52B788" opacity="0.3" />
        <text x="510" y="100" textAnchor="middle" fontSize="10" fill="#5A7A58" fontFamily="var(--font-outfit)">Agent</text>
      </g>

      {/* Human node (bottom-right) */}
      <g>
        <rect x="490" y="140" width="40" height="40" rx="10" fill="#0A0F0D" stroke="rgba(82,183,136,0.15)" strokeWidth="1" />
        {/* Person icon — head + shoulders */}
        <circle cx="510" cy="152" r="5" fill="none" stroke="#6FCF97" strokeWidth="1" opacity="0.6" />
        <path d="M500,170 Q500,162 510,162 Q520,162 520,170" fill="none" stroke="#6FCF97" strokeWidth="1" opacity="0.5" />
        <text x="510" y="194" textAnchor="middle" fontSize="10" fill="#5A7A58" fontFamily="var(--font-outfit)">Human</text>
      </g>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   SLIDE 3 — THE SWARM (mesh topology)
   ───────────────────────────────────────────────────────────── */

function SlideSwarm() {
  const leftDbs = [
    { label: 'PostgreSQL', type: 'db', y: 40 },
    { label: 'MongoDB', type: 'leaf', y: 110 },
    { label: 'Redis', type: 'db', y: 180 },
  ]

  const rightDbs = [
    { label: 'MySQL', type: 'db', y: 40 },
    { label: 'APIs', type: 'api', y: 110 },
    { label: 'Elasticsearch', type: 'search', y: 180 },
  ]

  return (
    <svg className="w-full" viewBox="0 0 600 220" fill="none">
      <defs>
        <filter id="swarm-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Left DB → Baseil-1 lines */}
      {leftDbs.map((db, i) => (
        <g key={`ldb-${i}`}>
          <line x1="60" y1={db.y} x2="168" y2="110" stroke="rgba(82,183,136,0.14)" strokeWidth="1" />
          <circle r="2" fill="#52B788" opacity="0.5">
            <animateMotion dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" path={`M60,${db.y} L168,110`} />
          </circle>
        </g>
      ))}

      {/* Right DB → Baseil-2 lines */}
      {rightDbs.map((db, i) => (
        <g key={`rdb-${i}`}>
          <line x1="540" y1={db.y} x2="432" y2="110" stroke="rgba(82,183,136,0.14)" strokeWidth="1" />
          <circle r="2" fill="#6FCF97" opacity="0.5">
            <animateMotion dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" path={`M540,${db.y} L432,110`} />
          </circle>
        </g>
      ))}

      {/* Mesh line: Baseil-1 ↔ Baseil-2 */}
      <line x1="220" y1="110" x2="380" y2="110" stroke="rgba(111,207,151,0.2)" strokeWidth="1.5" strokeDasharray="6 4" />
      {/* Bidirectional particles */}
      <circle r="3" fill="#6FCF97" opacity="0.7">
        <animateMotion dur="3s" repeatCount="indefinite" path="M220,110 L380,110" />
      </circle>
      <circle r="3" fill="#52B788" opacity="0.7">
        <animateMotion dur="3.4s" repeatCount="indefinite" path="M380,110 L220,110" />
      </circle>

      {/* Left DB nodes */}
      {leftDbs.map((db, i) => (
        <g key={`lnode-${i}`}>
          <rect x={22} y={db.y - 16} width="32" height="32" rx="7" fill="#0A0F0D" stroke="rgba(82,183,136,0.15)" strokeWidth="1" />
          <SourceIcon type={db.type} cx={38} cy={db.y} color="#52B788" />
          <text x={38} y={db.y + 26} textAnchor="middle" fontSize="9" fill="#5A7A58" fontFamily="var(--font-outfit)">{db.label}</text>
        </g>
      ))}

      {/* Right DB nodes */}
      {rightDbs.map((db, i) => (
        <g key={`rnode-${i}`}>
          <rect x={546} y={db.y - 16} width="32" height="32" rx="7" fill="#0A0F0D" stroke="rgba(82,183,136,0.15)" strokeWidth="1" />
          <SourceIcon type={db.type} cx={562} cy={db.y} color="#6FCF97" />
          <text x={562} y={db.y + 26} textAnchor="middle" fontSize="9" fill="#5A7A58" fontFamily="var(--font-outfit)">{db.label}</text>
        </g>
      ))}

      {/* Baseil-1 (left) */}
      <g>
        <circle cx="195" cy="110" r="35" fill="none" stroke="rgba(82,183,136,0.06)" strokeWidth="1">
          <animate attributeName="r" values="35;38;35" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.3;1" dur="4s" repeatCount="indefinite" />
        </circle>
        <rect x="168" y="83" width="54" height="54" rx="14" fill="#0A0F0D" stroke="rgba(82,183,136,0.2)" strokeWidth="1.5" />
        <image href="/robot/robot-leaf.png" x="177" y="90" width="36" height="40" />
        <text x="195" y="152" textAnchor="middle" fontSize="10" fill="#52B788" fontFamily="var(--font-outfit)" opacity="0.6">baseil-1</text>
      </g>

      {/* Baseil-2 (right) */}
      <g>
        <circle cx="405" cy="110" r="35" fill="none" stroke="rgba(111,207,151,0.06)" strokeWidth="1">
          <animate attributeName="r" values="35;38;35" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.3;1" dur="4s" repeatCount="indefinite" />
        </circle>
        <rect x="378" y="83" width="54" height="54" rx="14" fill="#0A0F0D" stroke="rgba(111,207,151,0.2)" strokeWidth="1.5" />
        <image href="/robot/robot-leaf.png" x="387" y="90" width="36" height="40" />
        <text x="405" y="152" textAnchor="middle" fontSize="10" fill="#6FCF97" fontFamily="var(--font-outfit)" opacity="0.6">baseil-2</text>
      </g>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */

export function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const hasTrackedRef = useRef(false)

  const [visible, setVisible] = useState(false)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [glow, setGlow] = useState({ x: 50, y: 50 })

  const { currentSlide, isTransitioning, jumpToSlide, pause, resume } = useProblemTimer()

  const slide = SLIDES[currentSlide]

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (!hasTrackedRef.current) {
            trackEvent('section_view', { section_name: 'problem' })
            hasTrackedRef.current = true
          }
          resume()
        } else {
          pause()
        }
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [pause, resume])

  // Reset to slide 0 on re-entry
  useEffect(() => {
    if (visible) jumpToSlide(0)
    // only on mount-like re-visibility — intentionally not tracking jumpToSlide
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const t = getTilt(e, cardRef.current, 0.8)
    setTilt({ rotateX: t.rotateX, rotateY: t.rotateY })
    setGlow({ x: t.glowX, y: t.glowY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 })
    setGlow({ x: 50, y: 50 })
    resume()
  }, [resume])

  const handleMouseEnter = useCallback(() => {
    pause()
  }, [pause])

  const slideComponents = [<SlideProblem key="s0" />, <SlideSolution key="s1" />, <SlideSwarm key="s2" />]

  return (
    <section id="problem" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#52B788]/15 to-transparent" />

      <div className="max-w-[1100px] mx-auto px-6">
        {/* Section label */}
        <div className="text-center mb-16">
          <span className="text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/50 mb-4 block">
            // The Problem
          </span>
          <h2 className="font-[var(--font-newsreader)] text-[clamp(2rem,4vw,3.2rem)] text-[#C8D8C4] leading-tight">
            Your AI agents need a data intelligence layer.
          </h2>
        </div>

        {/* Carousel card */}
        <div className="relative max-w-[800px] mx-auto" style={{ perspective: '800px' }}>
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative bg-[#111916]/80 border rounded-2xl p-6 md:p-10 overflow-hidden tilt-card hover-inner-glow"
            style={{
              transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              borderColor: `${slide.accent}15`,
              transition: 'border-color 0.6s ease',
              '--glow-x': `${glow.x}%`,
              '--glow-y': `${glow.y}%`,
            } as React.CSSProperties}
          >
            <div className="absolute inset-0 baseil-grain opacity-[0.02]" />

            <div className="flex flex-col items-center gap-5 md:gap-8">
              {/* Description text — crossfade using grid stacking for auto height */}
              <div className="grid w-full max-w-[500px]">
                {SLIDES.map((s, i) => (
                  <p
                    key={s.id}
                    className="font-[var(--font-outfit)] text-[0.9rem] md:text-[1rem] text-center leading-relaxed [grid-area:1/1]"
                    style={{
                      color: i === 0 ? '#5A7A58' : '#8FAF8A',
                      opacity: currentSlide === i && !isTransitioning ? 1 : 0,
                      transition: `opacity ${TRANSITION_MS}ms ease`,
                      pointerEvents: currentSlide === i ? 'auto' : 'none',
                    }}
                  >
                    {s.description}
                  </p>
                ))}
              </div>

              {/* SVG diagram — crossfade */}
              <div className="relative w-full max-w-none md:max-w-[600px] h-[200px] md:h-[220px]">
                {slideComponents.map((comp, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 -mx-2 md:mx-0"
                    style={{
                      opacity: currentSlide === i && !isTransitioning ? 1 : 0,
                      transition: `opacity ${TRANSITION_MS}ms ease`,
                      pointerEvents: currentSlide === i ? 'auto' : 'none',
                    }}
                  >
                    {comp}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-6 mt-6">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => jumpToSlide(i)}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <span
                  className="block w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: currentSlide === i ? s.accent : 'rgba(90,122,88,0.3)',
                    boxShadow: currentSlide === i ? `0 0 8px ${s.accent}60` : 'none',
                    transform: currentSlide === i ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
                <span
                  className="text-[0.65rem] font-[var(--font-outfit)] uppercase tracking-[0.15em] transition-colors duration-300"
                  style={{
                    color: currentSlide === i ? s.accent : '#3D5A3A',
                  }}
                >
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
