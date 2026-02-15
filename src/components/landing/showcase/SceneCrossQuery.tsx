'use client'

import { Clock, TableIcon, Sparkles, Database, Merge, ThumbsUp, ThumbsDown } from 'lucide-react'
import { CROSS_QUERY_DATA } from './data'
import { TypingText } from './TypingText'

interface SceneCrossQueryProps {
  progress: number // 0-1
}

export function SceneCrossQuery({ progress }: SceneCrossQueryProps) {
  // Timeline:
  // 0.00-0.18: typing query
  // 0.18-0.22: pause
  // 0.22-0.28: loading shimmer (Analyzing, Decomposing, Routing)
  // 0.28-0.36: first routing card (Demo HR) slides in
  // 0.36-0.44: second routing card (Demo Store) slides in
  // 0.44-0.50: join indicator animates
  // 0.50-0.75: results table rows stagger in
  // 0.75-0.82: metrics fade in
  // 0.82-1.00: hold

  const isTyping = progress < 0.18
  const showLoading = progress >= 0.18 && progress < 0.28
  const showRoute1 = progress >= 0.28
  const showRoute2 = progress >= 0.36
  const showJoin = progress >= 0.44
  const joinComplete = progress >= 0.50
  const showResults = progress >= 0.50
  const showMetrics = progress >= 0.75
  const showFeedback = progress >= 0.82
  const thumbsUpActive = progress >= 0.90

  const visibleRows = showResults
    ? Math.min(Math.floor(((progress - 0.50) / 0.25) * CROSS_QUERY_DATA.rows.length + 1), CROSS_QUERY_DATA.rows.length)
    : 0

  return (
    <div>
      {/* Query input */}
      <div className="px-7 py-4 border-b border-[#52B788]/[0.06]">
        <div className="flex items-center gap-2.5">
          <span className="text-[#52B788]/50 font-[var(--font-outfit)] text-[0.95rem] select-none">&gt;</span>
          {isTyping ? (
            <TypingText
              text={CROSS_QUERY_DATA.question}
              charDelay={35}
              randomVariance={10}
              className="text-[0.95rem] font-[var(--font-outfit)] text-[#E0EAD8]"
            />
          ) : (
            <span className="text-[0.95rem] font-[var(--font-outfit)] text-[#E0EAD8]">
              {CROSS_QUERY_DATA.question}
            </span>
          )}
        </div>
      </div>

      <div className="px-7 py-5">
        {/* Loading state */}
        {showLoading && (
          <div className="flex items-center gap-3 mb-5">
            <div className="flex gap-1.5">
              {['Analyzing', 'Decomposing', 'Routing'].map((step, i) => (
                <span
                  key={step}
                  className="px-2.5 py-1 rounded text-[0.7rem] font-[var(--font-outfit)] bg-[#52B788]/[0.06] border border-[#52B788]/[0.1] text-[#8FAF8A] animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Multi-source routing cards */}
        <div className="space-y-2.5 mb-4">
          {CROSS_QUERY_DATA.sources.map((source, i) => {
            const visible = i === 0 ? showRoute1 : showRoute2
            return (
              <div
                key={source.database}
                className={`rounded-lg bg-[#52B788]/[0.06] border border-[#52B788]/10 border-l-2 border-l-[#52B788]/40 px-4 py-2.5 transition-all duration-500 ${
                  visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Database size={13} className="text-[#52B788]" />
                  <span className="text-[0.78rem] font-[var(--font-outfit)] text-[#C8D8C4]">
                    <span className="text-[#6FCF97]">{source.database}</span>
                    <span className="text-[#8FAF8A] ml-1.5">.{source.table}</span>
                  </span>
                  <span className="text-[0.7rem] font-[var(--font-outfit)] text-[#8FAF8A] ml-auto">
                    {source.confidence}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Join indicator */}
        {showJoin && (
          <div className={`flex items-center gap-2.5 mb-4 px-2 transition-all duration-500 ${
            showJoin ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <div className="flex-1 h-px bg-[#52B788]/10" />
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-500 ${
              joinComplete
                ? 'bg-[#52B788]/[0.08] border-[#52B788]/20 text-[#52B788]'
                : 'bg-[#52B788]/[0.06] border-[#52B788]/[0.1] text-[#8FAF8A]'
            }`}>
              <Merge size={12} />
              <span className="text-[0.68rem] font-[var(--font-outfit)]">
                {joinComplete ? 'Joined' : 'Joining...'}
              </span>
            </div>
            <div className="flex-1 h-px bg-[#52B788]/10" />
          </div>
        )}

        {/* Results table */}
        {showResults && (
          <div>
            <table className="w-full text-left">
              <thead>
                <tr>
                  {CROSS_QUERY_DATA.columns.map((col, i) => (
                    <th
                      key={i}
                      className="text-[0.7rem] font-[var(--font-outfit)] font-normal text-[#8FAF8A] uppercase tracking-wider pb-2.5 pr-4"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CROSS_QUERY_DATA.rows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-t border-[#52B788]/[0.06] transition-all duration-400 ${
                      i < visibleRows ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`py-2 pr-4 text-[0.85rem] font-[var(--font-outfit)] ${
                          j === 0 ? 'text-[#E0EAD8]' : j === 3 ? 'text-[#52B788]' : 'text-[#C8D8C4]'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Metrics footer */}
            <div className={`flex items-center gap-3.5 mt-4 pt-3 border-t border-[#52B788]/[0.06] transition-all duration-500 ${
              showMetrics ? 'opacity-100' : 'opacity-0'
            }`}>
              <span className="flex items-center gap-1.5 text-[0.7rem] font-[var(--font-outfit)] text-[#5A7A58]">
                <Clock size={11} /> {CROSS_QUERY_DATA.metrics.duration}
              </span>
              <span className="flex items-center gap-1.5 text-[0.7rem] font-[var(--font-outfit)] text-[#5A7A58]">
                <TableIcon size={11} /> {CROSS_QUERY_DATA.metrics.rows} rows
              </span>
              <span className="flex items-center gap-1.5 text-[0.7rem] font-[var(--font-outfit)] text-[#5A7A58]">
                <Sparkles size={11} /> {CROSS_QUERY_DATA.metrics.sources}
              </span>

              {/* Feedback buttons */}
              {showFeedback && (
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    className={`p-1.5 rounded transition-all duration-300 ${
                      thumbsUpActive
                        ? 'bg-[#52B788]/15 text-[#52B788]'
                        : 'text-[#5A7A58] hover:text-[#8FAF8A]'
                    }`}
                  >
                    <ThumbsUp size={13} />
                  </button>
                  <button className="p-1.5 rounded text-[#5A7A58] hover:text-[#8FAF8A] transition-all duration-300">
                    <ThumbsDown size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
