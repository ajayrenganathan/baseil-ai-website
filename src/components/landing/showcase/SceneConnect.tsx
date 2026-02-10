'use client'

import { Database } from 'lucide-react'
import { CONNECTIONS } from './data'

interface SceneConnectProps {
  progress: number // 0-1
}

export function SceneConnect({ progress }: SceneConnectProps) {
  // Timeline: 0-0.2 existing cards visible, 0.2-0.5 HR card slides in, 0.5-0.7 Marketing slides in, 0.7-1.0 counter fades in
  const showHR = progress > 0.2
  const showMarketing = progress > 0.5
  const showCounter = progress > 0.7

  return (
    <div className="px-8 py-8">
      {/* 2x2 grid of connection cards */}
      <div className="grid grid-cols-2 gap-4 max-w-[540px] mx-auto">
        {CONNECTIONS.map((conn, i) => {
          const isNew = !conn.existing
          const isHR = i === 2
          const isMarketing = i === 3

          let visible = conn.existing
          if (isHR) visible = showHR
          if (isMarketing) visible = showMarketing

          // Pulse animation for newly added cards
          const isNewlyAdded = (isHR && showHR && progress < 0.5) || (isMarketing && showMarketing && progress < 0.8)

          return (
            <div
              key={conn.name}
              className={`rounded-lg border bg-[#111916]/60 p-6 flex flex-col items-center gap-3 transition-all duration-700 ${
                visible
                  ? 'opacity-100 translate-y-0 border-[#52B788]/10'
                  : 'opacity-0 translate-y-6 border-transparent'
              } ${isNewlyAdded ? 'shadow-[0_0_20px_rgba(82,183,136,0.1)]' : ''}`}
            >
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center transition-colors duration-500 ${
                visible ? 'bg-[#52B788]/[0.08]' : 'bg-[#52B788]/[0.02]'
              }`}>
                <Database size={24} className="text-[#52B788]/60" />
              </div>
              <span className="text-[0.92rem] font-[var(--font-outfit)] text-[#C8D8C4] text-center">
                {conn.name}
              </span>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                  visible ? 'bg-[#52B788]' : 'bg-[#5A7A58]/30'
                } ${isNewlyAdded ? 'animate-pulse' : ''}`} />
                <span className="text-[0.75rem] font-[var(--font-outfit)] text-[#5A7A58]">
                  {conn.status}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Counter */}
      <div className={`text-center mt-8 transition-all duration-700 ${
        showCounter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}>
        <span className="text-[0.88rem] font-[var(--font-outfit)] text-[#5A7A58]">
          4 databases connected
        </span>
      </div>
    </div>
  )
}
