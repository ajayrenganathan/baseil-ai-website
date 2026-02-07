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

export function Sandbox() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [activeTab, setActiveTab] = useState<'results' | 'sql'>('results')
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,_rgba(14,230,212,0.04)_0%,_transparent_60%)]" />

      <div className="max-w-[900px] mx-auto px-6">
        {/* Section label */}
        <div className="text-center mb-14">
          <span className="text-[0.7rem] font-[var(--font-dm-sans)] uppercase tracking-[0.2em] text-[#0ee6d4]/60 mb-4 block">
            Live Demo
          </span>
          <h2 className="font-[var(--font-instrument-serif)] text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#e8e6e3] leading-tight mb-3">
            Try it yourself.
          </h2>
          <p className="font-[var(--font-dm-sans)] text-[0.95rem] text-[#6a6a7a]">
            Query a live sample database in plain English. No signup required.
          </p>
        </div>

        {/* Console */}
        <div
          className={`relative rounded-2xl border border-white/[0.06] bg-[#0a0a14]/80 backdrop-blur-sm overflow-hidden transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Console header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#0ee6d4]/[0.06] border border-[#0ee6d4]/10">
                <Database size={12} className="text-[#0ee6d4]/70" />
                <span className="text-[0.7rem] font-[var(--font-dm-sans)] text-[#0ee6d4]/70">Sample E-commerce DB</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
            <span className="text-[0.65rem] font-[var(--font-dm-sans)] text-[#3a3a4a] italic">
              This is a real dbzero instance
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
                  placeholder="Ask anything about the data..."
                  rows={2}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-[0.9rem] font-[var(--font-dm-sans)] text-[#c8c8d8] placeholder:text-[#3a3a4a] focus:outline-none focus:border-[#0ee6d4]/20 focus:bg-white/[0.04] resize-none transition-all duration-300"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading || !query.trim()}
                className="self-end h-[46px] w-[46px] rounded-xl bg-[#0ee6d4]/10 border border-[#0ee6d4]/20 flex items-center justify-center text-[#0ee6d4] hover:bg-[#0ee6d4]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
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
                    className="flex items-center gap-1.5 text-[0.72rem] font-[var(--font-dm-sans)] px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[#5a5a6a] hover:text-[#8a8a9a] hover:border-white/[0.08] transition-all duration-300"
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
              <div className="flex items-center gap-3 text-[0.8rem] font-[var(--font-dm-sans)] text-[#5a5a6a]">
                <div className="flex gap-1">
                  {['Analyzing', 'Selecting tools', 'Building query', 'Executing'].map((step, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[0.65rem] bg-white/[0.02] border border-white/[0.04] animate-pulse"
                      style={{ animationDelay: `${i * 0.4}s` }}
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
            <div className="border-t border-white/[0.04]">
              {/* Result tabs */}
              <div className="flex items-center gap-0 px-5 border-b border-white/[0.04]">
                {(['results', 'sql'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 text-[0.75rem] font-[var(--font-dm-sans)] border-b-2 transition-all duration-300 ${
                      activeTab === tab
                        ? 'border-[#0ee6d4] text-[#0ee6d4]'
                        : 'border-transparent text-[#5a5a6a] hover:text-[#8a8a9a]'
                    }`}
                  >
                    {tab === 'results' ? 'Results' : 'SQL Executed'}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-3 text-[0.7rem] font-[var(--font-dm-sans)] text-[#3a3a4a]">
                  <span className="flex items-center gap-1"><Clock size={11} />{MOCK_RESULT.duration}</span>
                  <span className="flex items-center gap-1"><TableIcon size={11} />{MOCK_RESULT.rows_returned} rows</span>
                </div>
              </div>

              {/* Results table */}
              {activeTab === 'results' && (
                <div className="p-5 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        {MOCK_RESULT.columns.map((col, i) => (
                          <th key={i} className="text-left text-[0.7rem] font-[var(--font-dm-sans)] font-medium text-[#5a5a6a] uppercase tracking-wider pb-3 pr-6">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_RESULT.rows.map((row, i) => (
                        <tr key={i} className="border-t border-white/[0.03]">
                          {row.map((cell, j) => (
                            <td key={j} className="py-2.5 pr-6 text-[0.8rem] font-[var(--font-dm-sans)] text-[#b0b0c0]">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* SQL view */}
              {activeTab === 'sql' && (
                <div className="p-5">
                  <pre className="text-[0.75rem] font-mono text-[#7a8a9a] leading-relaxed whitespace-pre-wrap">
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
            className="inline-flex items-center gap-2 text-[0.8rem] font-[var(--font-dm-sans)] text-[#5a5a6a] hover:text-[#0ee6d4] transition-colors duration-300"
          >
            Want this on your own data?
            <ChevronRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
