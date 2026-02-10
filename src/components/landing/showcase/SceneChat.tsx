'use client'

import { Bot, User, Wrench, Clock, Check } from 'lucide-react'
import { CHAT_DATA } from './data'
import { TypingText } from './TypingText'

interface SceneChatProps {
  progress: number // 0-1
}

export function SceneChat({ progress }: SceneChatProps) {
  // Timeline:
  // 0.00-0.05: agent config fades in
  // 0.05-0.20: user message types in
  // 0.20-0.25: pause
  // 0.25-0.40: tool call card slides in with progress
  // 0.40-0.75: bot response types in (longer text now)
  // 0.75-0.85: metrics fade in
  // 0.85-1.00: hold

  const showAgent = progress >= 0.0
  const isTypingUser = progress >= 0.05 && progress < 0.20
  const showUserMessage = progress >= 0.05
  const showToolCall = progress >= 0.25
  const toolCallProgress = showToolCall ? Math.min((progress - 0.25) / 0.15, 1) : 0
  const toolCallCollapsed = progress >= 0.42
  const showBotResponse = progress >= 0.40
  const isTypingBot = progress >= 0.40 && progress < 0.75
  const showMetrics = progress >= 0.75

  return (
    <div className="px-8 py-7">
      {/* Agent config badge */}
      <div className={`mb-6 transition-all duration-500 ${
        showAgent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#111916]/60 border border-[#52B788]/10">
          <Bot size={16} className="text-[#52B788]/60" />
          <span className="text-[0.88rem] font-[var(--font-outfit)] text-[#8FAF8A]">
            {CHAT_DATA.agent.name}
          </span>
          <span className="text-[0.75rem] font-[var(--font-outfit)] text-[#3D5A3A]">
            {CHAT_DATA.agent.tools} tool
          </span>
        </div>
      </div>

      {/* User message bubble */}
      {showUserMessage && (
        <div className="flex gap-3.5 mb-6">
          <div className="w-9 h-9 rounded-full bg-[#52B788]/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5">
            <User size={16} className="text-[#52B788]/50" />
          </div>
          <div className="rounded-lg bg-[#111916]/80 border border-[#52B788]/[0.06] px-5 py-3 max-w-[85%]">
            {isTypingUser ? (
              <TypingText
                text={CHAT_DATA.userMessage}
                charDelay={35}
                randomVariance={10}
                className="text-[1rem] font-[var(--font-outfit)] text-[#C8D8C4]"
              />
            ) : (
              <span className="text-[1rem] font-[var(--font-outfit)] text-[#C8D8C4]">
                {CHAT_DATA.userMessage}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tool call card — smooth collapse after completion */}
      {showToolCall && (
        <div className={`ml-12 transition-all duration-700 ease-in-out ${toolCallCollapsed ? 'mb-4' : 'mb-6'}`}>
          <div className={`rounded-lg border bg-[#111916]/60 transition-all duration-700 ease-in-out overflow-hidden ${
            toolCallCollapsed
              ? 'border-[#52B788]/10 border-l-2 border-l-[#52B788]/30'
              : 'border-amber-500/10 border-l-2 border-l-amber-500/40'
          }`}>
            {/* Expanded: full tool call with progress */}
            <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
              toolCallCollapsed ? 'max-h-0 opacity-0' : 'max-h-28 opacity-100'
            }`}>
              <div className="px-5 py-3.5">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <Wrench size={14} className="text-amber-500/60" />
                  <span className="text-[0.82rem] font-[var(--font-outfit)] text-amber-500/70">
                    Tool call
                  </span>
                  <span className="text-[0.78rem] font-[var(--font-outfit)] text-[#5A7A58] ml-auto">
                    {CHAT_DATA.toolCall.from}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[0.88rem] font-[var(--font-outfit)] text-[#8FAF8A]">
                    {CHAT_DATA.toolCall.tool}
                  </span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-amber-500/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500/50"
                    style={{ width: `${toolCallProgress * 100}%` }}
                  />
                </div>
              </div>
            </div>
            {/* Collapsed: single line summary */}
            <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
              toolCallCollapsed ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="px-4 py-2.5 flex items-center gap-2">
                <Check size={13} className="text-[#52B788]/60" />
                <span className="text-[0.78rem] font-[var(--font-outfit)] text-[#5A7A58]">
                  {CHAT_DATA.toolCall.tool}
                </span>
                <span className="text-[0.72rem] font-[var(--font-outfit)] text-[#3D5A3A] ml-auto">
                  completed
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bot response — inline text */}
      {showBotResponse && (
        <div className="flex gap-3.5 mb-4">
          <div className="w-9 h-9 rounded-full bg-[#52B788]/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Bot size={16} className="text-[#52B788]/50" />
          </div>
          <div className="flex-1 min-w-0">
            {isTypingBot ? (
              <TypingText
                text={CHAT_DATA.botResponse}
                charDelay={18}
                randomVariance={6}
                className="text-[1rem] font-[var(--font-outfit)] text-[#C8D8C4] whitespace-pre-wrap leading-relaxed"
              />
            ) : (
              <span className="text-[1rem] font-[var(--font-outfit)] text-[#C8D8C4] whitespace-pre-wrap leading-relaxed">
                {CHAT_DATA.botResponse}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Metrics footer */}
      <div className={`flex items-center gap-4 mt-5 pt-3.5 border-t border-[#52B788]/[0.04] transition-all duration-500 ${
        showMetrics ? 'opacity-100' : 'opacity-0'
      }`}>
        <span className="flex items-center gap-1.5 text-[0.75rem] font-[var(--font-outfit)] text-[#3D5A3A]">
          <Clock size={12} /> {CHAT_DATA.metrics.duration}
        </span>
        <span className="text-[0.75rem] font-[var(--font-outfit)] text-[#3D5A3A]">
          via {CHAT_DATA.metrics.via}
        </span>
      </div>
    </div>
  )
}
