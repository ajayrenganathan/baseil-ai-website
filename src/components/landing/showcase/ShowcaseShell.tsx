'use client'

import { ReactNode, useRef, useEffect, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { SCENES } from './data'

interface ShowcaseShellProps {
  title: string
  children: ReactNode
  currentScene: number
  totalProgress: number
  isPaused?: boolean
  onJumpToScene: (index: number) => void
  onTogglePause?: () => void
}

export function ShowcaseShell({
  title,
  children,
  currentScene,
  totalProgress,
  isPaused,
  onJumpToScene,
  onTogglePause,
}: ShowcaseShellProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const prevSceneRef = useRef(currentScene)
  const prevProgressRef = useRef(totalProgress)
  const [skipTransition, setSkipTransition] = useState(false)

  // Reset scroll to top when scene changes, skip bar transition on wrap
  useEffect(() => {
    if (prevSceneRef.current !== currentScene) {
      const el = contentRef.current
      if (el) el.scrollTop = 0
      // Detect wrap (progress jumped backwards significantly)
      if (totalProgress < prevProgressRef.current - 0.3) {
        setSkipTransition(true)
        requestAnimationFrame(() => setSkipTransition(false))
      }
      prevSceneRef.current = currentScene
    }
    prevProgressRef.current = totalProgress
  }, [currentScene, totalProgress])

  // Auto-scroll down when content overflows
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const overflow = el.scrollHeight - el.clientHeight
    if (overflow > 0) {
      el.scrollTo({ top: overflow, behavior: 'smooth' })
    }
  })

  return (
    <div className="rounded-2xl border border-[#52B788]/20 bg-[#0E1512] overflow-hidden shadow-[0_0_80px_rgba(82,183,136,0.08),0_20px_60px_rgba(0,0,0,0.5)]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#52B788]/[0.1] bg-[#0D1410]/60">
        <div className="flex items-center gap-3">
          <span className="text-[0.8rem] font-[var(--font-outfit)] text-[#8FAF8A] transition-all duration-300">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onTogglePause}
            className="p-1 rounded text-[#5A7A58] hover:text-[#8FAF8A] transition-colors cursor-pointer"
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
          </button>
          <span className="text-[0.7rem] font-[var(--font-outfit)] text-[#3D5A3A]">Baseil</span>
        </div>
      </div>

      {/* Content area — fixed height to prevent layout shift */}
      <div ref={contentRef} className="relative h-[500px] overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(82,183,136,0.8) 0.5px, transparent 0.5px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-soft-light baseil-grain" />
        {children}
      </div>

      {/* Scene progress indicator */}
      <div className="px-6 py-3.5 border-t border-[#52B788]/[0.06] bg-[#0D1410]/40">
        <div className="flex items-center gap-4 mb-2">
          {SCENES.map((scene, i) => (
            <button
              key={scene.id}
              onClick={() => onJumpToScene(i)}
              className={`text-[0.7rem] font-[var(--font-outfit)] transition-colors duration-300 cursor-pointer ${
                i === currentScene ? 'text-[#52B788]' : 'text-[#3D5A3A] hover:text-[#5A7A58]'
              }`}
            >
              {scene.label}
            </button>
          ))}
        </div>
        <div className="h-[2px] rounded-full bg-[#52B788]/[0.06]">
          <div
            className={`h-full rounded-full bg-[#52B788]/40 ${skipTransition ? '' : 'transition-all duration-300'}`}
            style={{ width: `${totalProgress * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
