'use client'

import { useState, useRef, useEffect } from 'react'
import { Database, Clock, Loader2, ChevronRight, TableIcon, Sparkles } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

const DATABASES = [
  {
    id: 'ecommerce',
    label: 'E-commerce',
    engine: 'PostgreSQL',
    queries: [
      'Show me the top 10 customers by revenue last quarter',
      'Which products had the highest return rate this month?',
      'Compare sales performance across all regions',
    ],
    results: {
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
    },
  },
  {
    id: 'inventory',
    label: 'Inventory',
    engine: 'PostgreSQL',
    queries: [
      'Which warehouses are running low on stock?',
      'Show reorder alerts for products below safety stock',
      'Compare inventory turnover across categories',
    ],
    results: {
      columns: ['Warehouse', 'SKUs Low', 'Fill Rate', 'Status'],
      rows: [
        ['Portland DC', '34', '72%', 'Reorder'],
        ['Austin DC', '18', '84%', 'Healthy'],
        ['Chicago DC', '27', '78%', 'Watch'],
        ['Atlanta DC', '12', '91%', 'Healthy'],
        ['Denver DC', '41', '65%', 'Critical'],
      ],
      sql: `SELECT w.name AS "Warehouse",
  COUNT(*) FILTER (WHERE i.qty < i.safety_stock) AS "SKUs Low",
  ROUND(AVG(i.qty::numeric / NULLIF(i.capacity, 0)) * 100) || '%' AS "Fill Rate",
  CASE
    WHEN AVG(i.qty::numeric / NULLIF(i.capacity, 0)) < 0.7 THEN 'Reorder'
    WHEN AVG(i.qty::numeric / NULLIF(i.capacity, 0)) < 0.8 THEN 'Watch'
    ELSE 'Healthy'
  END AS "Status"
FROM warehouses w JOIN inventory i ON w.id = i.warehouse_id
GROUP BY w.name ORDER BY "Fill Rate" ASC;`,
      duration: '180ms',
      rows_returned: 5,
    },
  },
  {
    id: 'hr',
    label: 'HR & Payroll',
    engine: 'PostgreSQL',
    queries: [
      'Show headcount by department with avg tenure',
      'Which teams have the highest attrition this year?',
      'Compare compensation bands across engineering levels',
    ],
    results: {
      columns: ['Department', 'Headcount', 'Avg Tenure', 'Open Roles'],
      rows: [
        ['Engineering', '142', '2.8 yrs', '12'],
        ['Sales', '87', '1.9 yrs', '8'],
        ['Product', '34', '3.2 yrs', '3'],
        ['Marketing', '28', '2.1 yrs', '5'],
        ['Operations', '53', '4.1 yrs', '2'],
      ],
      sql: `SELECT d.name AS "Department",
  COUNT(e.id) AS "Headcount",
  ROUND(AVG(EXTRACT(YEAR FROM AGE(NOW(), e.hire_date)))::numeric, 1)
    || ' yrs' AS "Avg Tenure",
  COUNT(*) FILTER (WHERE r.status = 'open') AS "Open Roles"
FROM departments d
  JOIN employees e ON d.id = e.department_id
  LEFT JOIN requisitions r ON d.id = r.department_id
GROUP BY d.name ORDER BY "Headcount" DESC;`,
      duration: '210ms',
      rows_returned: 5,
    },
  },
  {
    id: 'support',
    label: 'Support',
    engine: 'PostgreSQL',
    queries: [
      'What is the average resolution time by priority?',
      'Show the busiest support agents this week',
      'Which product areas generate the most tickets?',
    ],
    results: {
      columns: ['Priority', 'Tickets', 'Avg Resolution', 'SLA Met'],
      rows: [
        ['Critical', '24', '1.4 hrs', '92%'],
        ['High', '156', '4.2 hrs', '88%'],
        ['Medium', '410', '18.6 hrs', '95%'],
        ['Low', '283', '42.1 hrs', '97%'],
        ['Feature Request', '198', '—', '—'],
      ],
      sql: `SELECT t.priority AS "Priority",
  COUNT(*) AS "Tickets",
  ROUND(AVG(EXTRACT(EPOCH FROM (t.resolved_at - t.created_at)) / 3600)::numeric, 1)
    || ' hrs' AS "Avg Resolution",
  ROUND(COUNT(*) FILTER (WHERE t.sla_met)::numeric / COUNT(*) * 100)
    || '%' AS "SLA Met"
FROM tickets t
WHERE t.created_at >= NOW() - INTERVAL '30 days'
GROUP BY t.priority ORDER BY COUNT(*) ASC;`,
      duration: '150ms',
      rows_returned: 5,
    },
  },
]

// AI mode queries — each maps to a database baseil "auto-selects"
const AI_QUERIES = [
  { query: 'Which region had the most revenue growth?', dbIndex: 0 },
  { query: 'Which warehouses need restocking this week?', dbIndex: 1 },
  { query: 'Show me attrition rates across departments', dbIndex: 2 },
  { query: 'What is our average ticket resolution time?', dbIndex: 3 },
]

const LOADING_STEPS = ['Analyzing', 'Selecting tools', 'Building query', 'Executing']
const AI_LOADING_STEPS = ['Understanding intent', 'Scanning databases', 'Selecting source', 'Building query', 'Executing']

export function Sandbox() {
  const [aiMode, setAiMode] = useState(true)
  const [activeDb, setActiveDb] = useState(0)
  const [resolvedDb, setResolvedDb] = useState(-1)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [activeTab, setActiveTab] = useState<'results' | 'sql'>('results')
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [consoleGlow, setConsoleGlow] = useState(false)
  const [activeLoadingStep, setActiveLoadingStep] = useState(-1)

  const steps = aiMode ? AI_LOADING_STEPS : LOADING_STEPS
  const resultDb = aiMode ? DATABASES[resolvedDb] || DATABASES[0] : DATABASES[activeDb]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          trackEvent('section_view', { section_name: 'sandbox' })
        }
      },
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
    const stepInterval = aiMode ? 700 : 800
    const interval = setInterval(() => {
      step++
      if (step < steps.length) {
        setActiveLoadingStep(step)
      } else {
        clearInterval(interval)
      }
    }, stepInterval)
    return () => clearInterval(interval)
  }, [loading, aiMode, steps.length])

  // Console glow when result appears
  useEffect(() => {
    if (showResult) {
      setConsoleGlow(true)
      const timer = setTimeout(() => setConsoleGlow(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [showResult])

  const runQuery = (q: string) => {
    setQuery(q)
    setLoading(true)
    setShowResult(false)
    setActiveTab('results')

    if (aiMode) {
      const match = AI_QUERIES.find(aq =>
        q.toLowerCase().includes(aq.query.toLowerCase().slice(0, 20))
      )
      setResolvedDb(match ? match.dbIndex : 0)
    }

    setTimeout(() => {
      setLoading(false)
      setShowResult(true)
    }, aiMode ? 3800 : 3500)
  }

  const reset = () => {
    setQuery('')
    setShowResult(false)
    setLoading(false)
  }

  const switchDb = (index: number) => {
    setActiveDb(index)
    setAiMode(false)
    reset()
  }

  const switchToAi = () => {
    setAiMode(true)
    reset()
  }

  const currentQueries = aiMode
    ? AI_QUERIES.map(q => q.query)
    : DATABASES[activeDb].queries

  return (
    <section id="sandbox" ref={sectionRef} className="relative py-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,_rgba(82,183,136,0.04)_0%,_transparent_60%)]" />

      <div className="max-w-[1050px] mx-auto px-6">
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
          className={`relative rounded-2xl border border-[#52B788]/15 bg-[#111916] overflow-hidden transition-all duration-1000 min-h-[420px] ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            boxShadow: consoleGlow
              ? '0 0 40px rgba(82,183,136,0.2), 0 0 80px rgba(82,183,136,0.08), 0 4px 30px rgba(0,0,0,0.4)'
              : '0 4px 30px rgba(0,0,0,0.3), 0 0 1px rgba(82,183,136,0.1)',
            transition: 'box-shadow 1s ease-out, opacity 1s, transform 1s',
          }}
        >
          {/* Console header with AI mode + database selector */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-[#52B788]/[0.06] bg-[#0D1410]/50 overflow-x-auto">
            {/* AI mode button */}
            <button
              onClick={switchToAi}
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-[0.7rem] font-[var(--font-outfit)] border whitespace-nowrap transition-all duration-300 ${
                aiMode
                  ? 'bg-[#52B788]/[0.12] border-[#52B788]/25 text-[#52B788]'
                  : 'bg-[#52B788]/[0.02] border-[#52B788]/[0.06] text-[#3D5A3A] hover:text-[#5A7A58] hover:border-[#52B788]/10'
              }`}
            >
              <Sparkles size={11} />
              AI Mode
              {aiMode && <div className="w-1.5 h-1.5 rounded-full bg-[#52B788] animate-pulse" />}
            </button>

            <div className="w-px h-4 bg-[#52B788]/10 mx-1" />

            {/* Database tabs */}
            {DATABASES.map((d, i) => (
              <button
                key={d.id}
                onClick={() => switchDb(i)}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-[0.7rem] font-[var(--font-outfit)] border whitespace-nowrap transition-all duration-300 ${
                  !aiMode && activeDb === i
                    ? 'bg-[#52B788]/[0.1] border-[#52B788]/20 text-[#52B788]/90'
                    : 'bg-[#52B788]/[0.02] border-[#52B788]/[0.06] text-[#3D5A3A] hover:text-[#5A7A58] hover:border-[#52B788]/10'
                }`}
              >
                <Database size={11} />
                {d.label}
                <span className={`text-[0.6rem] ${!aiMode && activeDb === i ? 'text-[#52B788]/50' : 'text-[#3D5A3A]/60'}`}>
                  {d.engine}
                </span>
                {!aiMode && activeDb === i && <div className="w-1.5 h-1.5 rounded-full bg-[#52B788] animate-pulse" />}
              </button>
            ))}
          </div>

          {/* AI mode hint */}
          {aiMode && !loading && !showResult && (
            <div className="px-5 pt-3 pb-0">
              <p className="text-[0.7rem] font-[var(--font-outfit)] text-[#52B788]/50 flex items-center gap-1.5">
                <Sparkles size={10} />
                Baseil will automatically detect the right database for your question
              </p>
            </div>
          )}

          {/* Query area */}
          <div className="p-5">
            {/* Selected query display */}
            {(loading || showResult) && (
              <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl bg-[#0A0F0D]/60 border border-[#52B788]/8">
                {loading && <Loader2 size={14} className="text-[#52B788] animate-spin shrink-0" />}
                <span className="text-[0.9rem] font-[var(--font-outfit)] text-[#C8D8C4]">{query}</span>
              </div>
            )}

            {/* Clickable query suggestions */}
            {!showResult && !loading && (
              <div>
                <p className="text-[0.72rem] font-[var(--font-outfit)] text-[#3D5A3A] mb-3">
                  Click a question to try it:
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentQueries.map((q, i) => (
                    <button
                      key={`${aiMode}-${i}`}
                      onClick={() => runQuery(q)}
                      className="flex items-center gap-1.5 text-[0.78rem] font-[var(--font-outfit)] px-4 py-2 rounded-lg bg-[#52B788]/[0.04] border border-[#52B788]/[0.08] text-[#8FAF8A] hover:text-[#C8D8C4] hover:border-[#52B788]/20 hover:bg-[#52B788]/[0.08] transition-all duration-300 cursor-pointer"
                    >
                      <ChevronRight size={12} className="text-[#52B788]/50" />
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="px-5 pb-5">
              <div className="flex items-center gap-3 text-[0.8rem] font-[var(--font-outfit)] text-[#5A7A58]">
                <div className="flex gap-1 flex-wrap">
                  {steps.map((step, i) => (
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
              {/* Source badge for AI mode */}
              {aiMode && (
                <div className="px-5 pt-3 pb-0 flex items-center gap-2">
                  <span className="text-[0.65rem] font-[var(--font-outfit)] text-[#3D5A3A]">Source detected:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-[#52B788]/15 bg-[#52B788]/[0.06] text-[0.68rem] font-[var(--font-outfit)] text-[#52B788]/80">
                    <Database size={10} />
                    {resultDb.label}
                    <span className="text-[#52B788]/40">{resultDb.engine}</span>
                  </span>
                </div>
              )}

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
                  <span className="flex items-center gap-1"><Clock size={11} />{resultDb.results.duration}</span>
                  <span className="flex items-center gap-1"><TableIcon size={11} />{resultDb.results.rows_returned} rows</span>
                </div>
              </div>

              {activeTab === 'results' && (
                <div className="p-5 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        {resultDb.results.columns.map((col, i) => (
                          <th key={i} className="text-left text-[0.7rem] font-[var(--font-outfit)] font-medium text-[#5A7A58] uppercase tracking-wider pb-3 pr-6">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {resultDb.results.rows.map((row, i) => (
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
                    {resultDb.results.sql}
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
            onClick={(e) => { e.preventDefault(); trackEvent('cta_click', { button_label: 'want_on_your_data', section: 'sandbox' }); document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' }) }}
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
