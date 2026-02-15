'use client'

import { Clock, TableIcon, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react'
import { QUERY_DATA } from './data'
import { TypingText } from './TypingText'

interface SceneQueryProps {
  progress: number // 0-1
}

export function SceneQuery({ progress }: SceneQueryProps) {
  // Timeline:
  // 0.00-0.25: typing query
  // 0.25-0.30: pause
  // 0.30-0.38: loading shimmer
  // 0.38-0.45: routing card slides in
  // 0.45-0.70: results table rows stagger in
  // 0.70-0.75: metrics fade in
  // 0.75-1.00: hold

  const isTyping = progress < 0.25
  const typingProgress = Math.min(progress / 0.25, 1)
  const showLoading = progress >= 0.25 && progress < 0.38
  const showRouting = progress >= 0.38
  const showResults = progress >= 0.45
  const showMetrics = progress >= 0.70
  const showFeedback = progress >= 0.75
  const thumbsUpActive = progress >= 0.85

  const visibleRows = showResults
    ? Math.min(Math.floor(((progress - 0.45) / 0.25) * QUERY_DATA.rows.length + 1), QUERY_DATA.rows.length)
    : 0

  return (
    <div>
      {/* Query input */}
      <div className="px-7 py-4 border-b border-[#52B788]/[0.04]">
        <div className="flex items-center gap-2.5">
          <span className="text-[#52B788]/30 font-[var(--font-outfit)] text-[0.95rem] select-none">&gt;</span>
          {isTyping ? (
            <TypingText
              text={QUERY_DATA.question}
              charDelay={40}
              randomVariance={12}
              className="text-[0.95rem] font-[var(--font-outfit)] text-[#C8D8C4]"
            />
          ) : (
            <span className="text-[0.95rem] font-[var(--font-outfit)] text-[#C8D8C4]">
              {QUERY_DATA.question}
            </span>
          )}
        </div>
      </div>

      <div className="px-7 py-5">
        {/* Loading state */}
        {showLoading && (
          <div className="flex items-center gap-3 mb-5">
            <div className="flex gap-1.5">
              {['Analyzing', 'Routing', 'Executing'].map((step, i) => (
                <span
                  key={step}
                  className="px-2.5 py-1 rounded text-[0.7rem] font-[var(--font-outfit)] bg-[#52B788]/[0.04] border border-[#52B788]/[0.06] text-[#5A7A58] animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Routing card */}
        {showRouting && (
          <div className={`mb-5 rounded-lg bg-[#52B788]/[0.06] border border-[#52B788]/15 border-l-2 border-l-[#52B788]/60 px-5 py-3 transition-all duration-500 ${
            showRouting ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
          }`}>
            <div className="flex items-center gap-2.5">
              <Sparkles size={14} className="text-[#52B788]" />
              <span className="text-[0.8rem] font-[var(--font-outfit)] text-[#C8D8C4]">
                Matched: <span className="text-[#6FCF97] font-medium">{QUERY_DATA.routing.database}</span>
              </span>
              <span className="text-[0.75rem] font-[var(--font-outfit)] text-[#6FCF97] ml-auto">
                Confidence: {QUERY_DATA.routing.confidence}%
              </span>
            </div>
          </div>
        )}

        {/* Results table */}
        {showResults && (
          <div>
            <table className="w-full text-left">
              <thead>
                <tr>
                  {QUERY_DATA.columns.map((col, i) => (
                    <th
                      key={i}
                      className="text-[0.75rem] font-[var(--font-outfit)] font-normal text-[#52B788]/70 uppercase tracking-wider pb-2.5 pr-4"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {QUERY_DATA.rows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-t border-[#52B788]/[0.06] transition-all duration-400 hover:bg-[#52B788]/[0.03] ${
                      i < visibleRows ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`py-2.5 pr-4 text-[0.9rem] font-[var(--font-outfit)] ${
                          j === 0 ? 'text-[#E0EAD8] font-medium' : 'text-[#C8D8C4]'
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
            <div className={`flex items-center gap-4 mt-4 pt-3 border-t border-[#52B788]/[0.04] transition-all duration-500 ${
              showMetrics ? 'opacity-100' : 'opacity-0'
            }`}>
              <span className="flex items-center gap-1.5 text-[0.7rem] font-[var(--font-outfit)] text-[#5A7A58]">
                <Clock size={11} /> {QUERY_DATA.metrics.duration}
              </span>
              <span className="flex items-center gap-1.5 text-[0.7rem] font-[var(--font-outfit)] text-[#5A7A58]">
                <TableIcon size={11} /> {QUERY_DATA.metrics.rows} rows
              </span>
              <span className="text-[0.7rem] font-[var(--font-outfit)] text-[#5A7A58]">
                {QUERY_DATA.metrics.source}
              </span>

              {/* Feedback buttons */}
              {showFeedback && (
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    className={`p-1.5 rounded transition-all duration-300 ${
                      thumbsUpActive
                        ? 'bg-[#52B788]/15 text-[#52B788]'
                        : 'text-[#3D5A3A] hover:text-[#5A7A58]'
                    }`}
                  >
                    <ThumbsUp size={13} />
                  </button>
                  <button className="p-1.5 rounded text-[#3D5A3A] hover:text-[#5A7A58] transition-all duration-300">
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
