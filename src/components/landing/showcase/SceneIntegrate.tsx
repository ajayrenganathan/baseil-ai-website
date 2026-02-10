'use client'

import { Terminal, MessageSquare, Plug, Code, User, Bot, Database } from 'lucide-react'
import { INTEGRATE_DATA } from './data'

const ICON_MAP = {
  terminal: Terminal,
  message: MessageSquare,
  plug: Plug,
  code: Code,
} as const

const METHOD_THRESHOLDS = [0.10, 0.30, 0.50, 0.65]

interface SceneIntegrateProps {
  progress: number // 0-1
}

export function SceneIntegrate({ progress }: SceneIntegrateProps) {
  // Timeline:
  // 0.00-0.10: central baseil endpoint fades in
  // 0.10-0.30: Query Console card slides in
  // 0.30-0.50: Chat card slides in
  // 0.50-0.65: MCP card slides in
  // 0.65-0.80: API card slides in
  // 0.80-1.00: connection dots animate, hold

  const showEndpoint = progress >= 0.0
  const showConnections = progress >= 0.80

  return (
    <div className="px-7 pt-7 pb-5">
      {/* Actors row */}
      <div className={`flex items-center gap-3.5 mb-5 transition-all duration-500 ${
        showEndpoint ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#111916]/60 border border-[#52B788]/[0.06]">
          <User size={13} className="text-[#52B788]/50" />
          <span className="text-[0.72rem] font-[var(--font-outfit)] text-[#5A7A58]">Users</span>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#111916]/60 border border-[#52B788]/[0.06]">
          <Bot size={13} className="text-[#52B788]/50" />
          <span className="text-[0.72rem] font-[var(--font-outfit)] text-[#5A7A58]">Agents</span>
        </div>
        <div className={`flex-1 h-px transition-all duration-700 ${
          showConnections ? 'bg-[#52B788]/20' : 'bg-[#52B788]/[0.04]'
        }`} />
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#52B788]/[0.06] border border-[#52B788]/15">
          <Database size={13} className="text-[#52B788]/60" />
          <span className="text-[0.72rem] font-[var(--font-outfit)] text-[#8FAF8A]">baseil</span>
        </div>
      </div>

      {/* Endpoint */}
      <div className={`mb-4 text-center transition-all duration-500 ${
        showEndpoint ? 'opacity-100' : 'opacity-0'
      }`}>
        <span className="text-[0.7rem] font-[var(--font-outfit)] text-[#3D5A3A]">
          {INTEGRATE_DATA.endpoint}
        </span>
      </div>

      {/* Method cards */}
      <div className="space-y-2.5">
        {INTEGRATE_DATA.methods.map((method, i) => {
          const Icon = ICON_MAP[method.icon]
          const visible = progress >= METHOD_THRESHOLDS[i]

          return (
            <div
              key={method.name}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-lg bg-[#111916]/80 border border-[#52B788]/[0.06] transition-all duration-500 ${
                visible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-4'
              }`}
            >
              <div className="w-8 h-8 rounded-md bg-[#52B788]/[0.06] flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-[#52B788]/50" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[0.88rem] font-[var(--font-outfit)] text-[#C8D8C4]">
                    {method.name}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#52B788]/60 flex-shrink-0" />
                </div>
                <span className="text-[0.72rem] font-[var(--font-outfit)] text-[#5A7A58]">
                  {method.desc}
                </span>
              </div>
              {/* Connection indicator */}
              <div className={`flex items-center gap-1.5 transition-all duration-500 ${
                showConnections ? 'opacity-100' : 'opacity-0'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]/30" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788]/20" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
