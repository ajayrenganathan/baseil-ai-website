'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Database, Clock, Loader2, ChevronRight, TableIcon } from 'lucide-react'

const SAMPLE_QUERIES = [
  'Show me the top 10 customers by revenue last quarter',
  'Which products had the highest return rate this month?',
  'Compare sales performance across all regions',
]

const MOCK_RESULT = {
  columns: ['Customer', 'Revenue', 'Orders', 'Region'],
  rows: [
    ['Meridian Corp', '$284,320', '142', 'North America'],
    ['Apex Industries', '$231,500', '98', 'Europe'],
    ['NovaTech Ltd', '$198,740', '87', 'Asia Pacific'],
    ['Stratos Group', '$176,200', '76', 'North America'],
    ['Luminary Inc', '$154,890', '64', 'Europe'],
  ],
  sql: `SELECT c.name AS "Customer", SUM(o.total) AS "Revenue",
  COUNT(o.id) AS "Orders", c.region AS "Region"
FROM customers c JOIN orders o ON c.id = o.customer_id
WHERE o.created_at >= NOW() - INTERVAL '3 months'
GROUP BY c.name, c.region
ORDER BY "Revenue" DESC LIMIT 10;`,
  duration: '340ms',
  rows_returned: 5,
}

const LOADING_STEPS = ['Analyzing', 'Selecting tools', 'Building query', 'Executing']

export function Sandbox() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [activeTab, setActiveTab] = useState<'results' | 'sql'>('results')
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const [consoleGlow, setConsoleGlow] = useState(false)
  const [activeLoadingStep, setActiveLoadingStep] = useState(-1)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Sequential loading step animation
  useEffect(() => {
    if (!loading) {
      setActiveLoadingStep(-1)
      return
    }
    let step = 0
    setActiveLoadingStep(0)
    const interval = setInterval(() => {
      step++
      if (step < LOADING_STEPS.length) {
        setActiveLoadingStep(step)
      } else {
        clearInterval(interval)
      }
    }, 400)
    return () => clearInterval(interval)
  }, [loading])

  // Console glow when result appears
  useEffect(() => {
    if (showResult) {
      setConsoleGlow(true)
      const timer = setTimeout(() => setConsoleGlow(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [showResult])

  const handleSubmit = () => {
    if (!query.trim()) return
    setLoading(true)
    setShowResult(false)
    setTimeout(() => {
      setLoading(false)
      setShowResult(true)
    }, 1800)
  }

  return (
    <section id="sandbox" ref={sectionRef} className="relative py-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,_rgba(82,183,136,0.04)_0%,_transparent_60%)]" />

      <div className="max-w-[900px] mx-auto px-6">
        {/* Section label */}
        <div className="text-center mb-14">
          <span className="text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/50 mb-4 block">
            Live Demo
          </span>
          <h2 className="font-[var(--font-newsreader)] text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#C8D8C4] leading-tight mb-3">
            Try it yourself.
          </h2>
          <p className="font-[var(--font-outfit)] text-[0.95rem] text-[#5A7A58]">
            Query a live sample database in plain English. No signup required.
          </p>
        </div>

        {/* Console */}
        <div
          className={`relative rounded-2xl border border-[#52B788]/8 bg-[#111916]/80 backdrop-blur-sm overflow-hidden transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            boxShadow: consoleGlow
              ? '0 0 40px rgba(82,183,136,0.15), 0 0 80px rgba(82,183,136,0.06)'
              : '0 0 0px rgba(82,183,136,0)',
            transition: 'box-shadow 1s ease-out, opacity 1s, transform 1s',
          }}
        >
          {/* Console header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#52B788]/[0.06] bg-[#0D1410]/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#52B788]/[0.06] border border-[#52B788]/10">
                <Database size={12} className="text-[#52B788]/60" />
                <span className="text-[0.7rem] font-[var(--font-outfit)] text-[#52B788]/70">Sample E-commerce DB</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#52B788] animate-pulse" />
              </div>
            </div>
            <span className="text-[0.65rem] font-[var(--font-outfit)] text-[#3D5A3A] italic">
              This is a real baseil instance
            </span>
          </div>

          {/* Query input area */}
          <div className="p-5">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="Ask anything about the data..."
                  rows={2}
                  className="w-full bg-[#0A0F0D]/60 border border-[#52B788]/8 rounded-xl px-4 py-3 text-[0.9rem] font-[var(--font-outfit)] text-[#C8D8C4] placeholder:text-[#3D5A3A] focus:outline-none focus:border-[#52B788]/25 focus:bg-[#0A0F0D]/80 resize-none transition-all duration-300"
                  style={{
                    boxShadow: inputFocused
                      ? '0 0 20px rgba(82,183,136,0.1), 0 0 40px rgba(82,183,136,0.04), inset 0 0 15px rgba(82,183,136,0.02)'
                      : '0 0 0px rgba(82,183,136,0)',
                  }}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading || !query.trim()}
                className="self-end h-[46px] w-[46px] rounded-xl bg-[#52B788]/10 border border-[#52B788]/15 flex items-center justify-center text-[#52B788] hover:bg-[#52B788]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>

            {/* Quick query suggestions */}
            {!showResult && !loading && (
              <div className="flex flex-wrap gap-2 mt-3">
                {SAMPLE_QUERIES.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(q)}
                    className="flex items-center gap-1.5 text-[0.72rem] font-[var(--font-outfit)] px-3 py-1.5 rounded-lg bg-[#52B788]/[0.03] border border-[#52B788]/[0.06] text-[#5A7A58] hover:text-[#8FAF8A] hover:border-[#52B788]/15 hover:bg-[#52B788]/[0.06] transition-all duration-300"
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget
                      el.style.transform = 'scale(1.02)'
                      el.style.boxShadow = '0 0 12px rgba(82,183,136,0.08)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget
                      el.style.transform = 'scale(1)'
                      el.style.boxShadow = '0 0 0px rgba(82,183,136,0)'
                    }}
                  >
                    <ChevronRight size={10} />
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="px-5 pb-5">
              <div className="flex items-center gap-3 text-[0.8rem] font-[var(--font-outfit)] text-[#5A7A58]">
                <div className="flex gap-1">
                  {LOADING_STEPS.map((step, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[0.65rem] border transition-all duration-500"
                      style={{
                        opacity: i <= activeLoadingStep ? 1 : 0.3,
                        transform: i <= activeLoadingStep ? 'translateY(0)' : 'translateY(8px)',
                        backgroundColor: i <= activeLoadingStep ? 'rgba(82,183,136,0.1)' : 'rgba(82,183,136,0.02)',
                        borderColor: i <= activeLoadingStep ? 'rgba(82,183,136,0.2)' : 'rgba(82,183,136,0.06)',
                        color: i <= activeLoadingStep ? '#52B788' : '#5A7A58',
                        boxShadow: i === activeLoadingStep ? '0 0 10px rgba(82,183,136,0.12)' : 'none',
                        transitionDelay: `${i * 0.05}s`,
                      }}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {showResult && (
            <div className="border-t border-[#52B788]/[0.06]">
              <div className="flex items-center gap-0 px-5 border-b border-[#52B788]/[0.06]">
                {(['results', 'sql'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 text-[0.75rem] font-[var(--font-outfit)] border-b-2 transition-all duration-300 ${
                      activeTab === tab
                        ? 'border-[#52B788] text-[#52B788]'
                        : 'border-transparent text-[#3D5A3A] hover:text-[#5A7A58]'
                    }`}
                  >
                    {tab === 'results' ? 'Results' : 'SQL Executed'}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-3 text-[0.7rem] font-[var(--font-outfit)] text-[#3D5A3A]">
                  <span className="flex items-center gap-1"><Clock size={11} />{MOCK_RESULT.duration}</span>
                  <span className="flex items-center gap-1"><TableIcon size={11} />{MOCK_RESULT.rows_returned} rows</span>
                </div>
              </div>

              {activeTab === 'results' && (
                <div className="p-5 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        {MOCK_RESULT.columns.map((col, i) => (
                          <th key={i} className="text-left text-[0.7rem] font-[var(--font-outfit)] font-medium text-[#5A7A58] uppercase tracking-wider pb-3 pr-6">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_RESULT.rows.map((row, i) => (
                        <tr
                          key={i}
                          className="border-t border-[#52B788]/[0.04] transition-colors duration-200 hover:bg-[#52B788]/[0.04] cursor-default"
                        >
                          {row.map((cell, j) => (
                            <td key={j} className="py-2.5 pr-6 text-[0.8rem] font-[var(--font-outfit)] text-[#8FAF8A]">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'sql' && (
                <div className="p-5">
                  <pre className="text-[0.75rem] font-mono text-[#5A7A58] leading-relaxed whitespace-pre-wrap">
                    {MOCK_RESULT.sql}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nudge CTA */}
        <div className="text-center mt-8">
          <a
            href="#early-access"
            onClick={(e) => { e.preventDefault(); document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 text-[0.8rem] font-[var(--font-outfit)] text-[#3D5A3A] hover:text-[#52B788] transition-colors duration-300"
          >
            Want this on your own data?
            <ChevronRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
