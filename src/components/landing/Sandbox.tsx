'use client'

import { useState, useRef, useEffect } from 'react'
import { Database, Clock, Loader2, ChevronRight, TableIcon, Sparkles } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

// One pre-recorded answer per question. Every row must be one the SQL above it
// could return: row count within LIMIT, rows in ORDER BY order, and only the
// values a CASE or FILTER can produce.
type Answer = {
  question: string
  summary: string
  columns: string[]
  rows: string[][]
  sql: string
  duration: string
}

type SampleDatabase = {
  id: string
  label: string
  engine: string
  answers: Answer[]
}

const DATABASES: SampleDatabase[] = [
  {
    id: 'ecommerce',
    label: 'E-commerce',
    engine: 'PostgreSQL',
    answers: [
      {
        question: 'Show me the top 10 customers by revenue last quarter',
        summary: 'Meridian Corp was the top customer last quarter, with $284,320 across 142 orders.',
        columns: ['Customer', 'Revenue', 'Orders', 'Region'],
        rows: [
          ['Meridian Corp', '$284,320', '142', 'North America'],
          ['Apex Industries', '$231,500', '98', 'Europe'],
          ['NovaTech Ltd', '$198,740', '87', 'Asia Pacific'],
          ['Stratos Group', '$176,200', '76', 'North America'],
          ['Luminary Inc', '$154,890', '64', 'Europe'],
          ['Halcyon Retail', '$142,610', '71', 'North America'],
          ['Kestrel Systems', '$128,950', '66', 'Europe'],
          ['Orchid Supply Co', '$117,300', '59', 'Asia Pacific'],
          ['Vantage Health', '$104,480', '52', 'North America'],
          ['Pampas Trading', '$96,720', '48', 'Latin America'],
        ],
        sql: `SELECT c.name AS "Customer", SUM(o.total) AS "Revenue",
  COUNT(o.id) AS "Orders", c.region AS "Region"
FROM customers c JOIN orders o ON c.id = o.customer_id
WHERE o.created_at >= date_trunc('quarter', NOW()) - INTERVAL '3 months'
  AND o.created_at < date_trunc('quarter', NOW())
GROUP BY c.id, c.name, c.region
ORDER BY "Revenue" DESC LIMIT 10;`,
        duration: '340ms',
      },
      {
        question: 'Which products had the highest return rate this month?',
        summary:
          'Among products with at least 50 units sold this month, the ErgoFlex Desk Chair has the highest return rate: 39 of 212 units (18.4%) came back.',
        columns: ['Product', 'Units sold', 'Units returned', 'Return rate'],
        rows: [
          ['ErgoFlex Desk Chair', '212', '39', '18.4%'],
          ['Halo Standing Desk', '158', '26', '16.5%'],
          ['Pulse Wireless Headset', '340', '47', '13.8%'],
          ['Lumen Monitor Arm', '275', '31', '11.3%'],
          ['Arc USB-C Dock', '96', '9', '9.4%'],
        ],
        sql: `SELECT p.name AS "Product",
  SUM(oi.quantity) AS "Units sold",
  SUM(oi.quantity) FILTER (WHERE oi.returned_at IS NOT NULL) AS "Units returned",
  ROUND(SUM(oi.quantity) FILTER (WHERE oi.returned_at IS NOT NULL)::numeric
    / SUM(oi.quantity) * 100, 1) || '%' AS "Return rate"
FROM order_items oi
  JOIN orders o ON o.id = oi.order_id
  JOIN products p ON p.id = oi.product_id
WHERE o.created_at >= date_trunc('month', NOW())
GROUP BY p.id, p.name
HAVING SUM(oi.quantity) >= 50
ORDER BY SUM(oi.quantity) FILTER (WHERE oi.returned_at IS NOT NULL)::numeric
  / SUM(oi.quantity) DESC NULLS LAST
LIMIT 5;`,
        duration: '260ms',
      },
      {
        question: 'Compare sales performance across all regions',
        summary:
          'North America brought in the most revenue last quarter ($1,184,300, 47.7% of the total), and Latin America the least ($148,200).',
        columns: ['Region', 'Revenue', 'Orders', 'Avg order', 'Share'],
        rows: [
          ['North America', '$1,184,300', '2,846', '$416', '47.7%'],
          ['Europe', '$736,800', '1,912', '$385', '29.7%'],
          ['Asia Pacific', '$412,600', '1,037', '$398', '16.6%'],
          ['Latin America', '$148,200', '431', '$344', '6.0%'],
        ],
        sql: `SELECT c.region AS "Region",
  SUM(o.total) AS "Revenue",
  COUNT(o.id) AS "Orders",
  ROUND(AVG(o.total)) AS "Avg order",
  ROUND(SUM(o.total) * 100.0 / SUM(SUM(o.total)) OVER (), 1) || '%' AS "Share"
FROM orders o JOIN customers c ON c.id = o.customer_id
WHERE o.created_at >= date_trunc('quarter', NOW()) - INTERVAL '3 months'
  AND o.created_at < date_trunc('quarter', NOW())
GROUP BY c.region
ORDER BY SUM(o.total) DESC;`,
        duration: '230ms',
      },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    engine: 'PostgreSQL',
    answers: [
      {
        question: 'Which warehouses are running low on stock?',
        summary:
          'Denver DC is lowest, at 65% of capacity with 41 SKUs below safety stock; Portland DC and Chicago DC are on watch.',
        columns: ['Warehouse', 'SKUs low', 'Stock level', 'Status'],
        rows: [
          ['Denver DC', '41', '65%', 'Reorder'],
          ['Portland DC', '34', '72%', 'Watch'],
          ['Chicago DC', '27', '78%', 'Watch'],
          ['Austin DC', '18', '84%', 'Healthy'],
          ['Atlanta DC', '12', '91%', 'Healthy'],
        ],
        sql: `SELECT w.name AS "Warehouse",
  COUNT(*) FILTER (WHERE i.qty < i.safety_stock) AS "SKUs low",
  ROUND(AVG(i.qty::numeric / NULLIF(i.capacity, 0)) * 100) || '%' AS "Stock level",
  CASE
    WHEN AVG(i.qty::numeric / NULLIF(i.capacity, 0)) < 0.7 THEN 'Reorder'
    WHEN AVG(i.qty::numeric / NULLIF(i.capacity, 0)) < 0.8 THEN 'Watch'
    ELSE 'Healthy'
  END AS "Status"
FROM warehouses w JOIN inventory i ON w.id = i.warehouse_id
GROUP BY w.id, w.name
ORDER BY AVG(i.qty::numeric / NULLIF(i.capacity, 0)) ASC;`,
        duration: '180ms',
      },
      {
        question: 'Show reorder alerts for products below safety stock',
        summary:
          'These are the eight items furthest below safety stock; the 2 m USB-C cable at Denver DC is the most urgent, with 12 on hand against a safety stock of 150.',
        columns: ['Product', 'Warehouse', 'On hand', 'Safety stock', 'Reorder qty'],
        rows: [
          ['USB-C cable, 2 m', 'Denver DC', '12', '150', '600'],
          ['HEPA filter', 'Portland DC', '6', '40', '120'],
          ['Shipping labels, 4x6', 'Denver DC', '30', '160', '800'],
          ['AA batteries, 24 pack', 'Chicago DC', '45', '200', '500'],
          ['Packing tape, 48 mm', 'Portland DC', '28', '120', '480'],
          ['Nitrile gloves, L', 'Austin DC', '60', '220', '600'],
          ['Small shipping box', 'Denver DC', '110', '350', '1,000'],
          ['HDMI adapter', 'Chicago DC', '22', '60', '200'],
        ],
        sql: `SELECT s.name AS "Product", w.name AS "Warehouse",
  i.qty AS "On hand", i.safety_stock AS "Safety stock",
  i.reorder_qty AS "Reorder qty"
FROM inventory i
  JOIN skus s ON s.id = i.sku_id
  JOIN warehouses w ON w.id = i.warehouse_id
WHERE i.qty < i.safety_stock
ORDER BY i.qty::numeric / i.safety_stock ASC
LIMIT 8;`,
        duration: '120ms',
      },
      {
        question: 'Compare inventory turnover across categories',
        summary:
          'Packaging turns over fastest, 15 times in the last 12 months; furniture is slowest, at 2 times.',
        columns: ['Category', 'Units sold (12 mo)', 'Avg on hand', 'Turnover'],
        rows: [
          ['Packaging', '96,000', '6,400', '15.0'],
          ['Office supplies', '54,600', '4,200', '13.0'],
          ['Cables and adapters', '38,400', '4,800', '8.0'],
          ['Cleaning', '21,780', '3,300', '6.6'],
          ['Electronics', '12,960', '3,600', '3.6'],
          ['Furniture', '1,840', '920', '2.0'],
        ],
        sql: `WITH sold AS (
  SELECT s.category, SUM(sh.qty) AS units_sold
  FROM shipments sh JOIN skus s ON s.id = sh.sku_id
  WHERE sh.shipped_at >= NOW() - INTERVAL '12 months'
  GROUP BY s.category
),
on_hand AS (
  SELECT category, AVG(units) AS avg_units
  FROM (
    SELECT s.category, snap.month, SUM(snap.qty) AS units
    FROM inventory_snapshots snap JOIN skus s ON s.id = snap.sku_id
    WHERE snap.month > date_trunc('month', NOW()) - INTERVAL '12 months'
    GROUP BY s.category, snap.month
  ) monthly
  GROUP BY category
)
SELECT category AS "Category",
  units_sold AS "Units sold (12 mo)",
  ROUND(avg_units) AS "Avg on hand",
  ROUND(units_sold / avg_units, 1) AS "Turnover"
FROM sold JOIN on_hand USING (category)
ORDER BY units_sold / avg_units DESC;`,
        duration: '410ms',
      },
    ],
  },
  {
    id: 'hr',
    label: 'HR & Payroll',
    engine: 'PostgreSQL',
    answers: [
      {
        question: 'Show headcount by department with avg tenure',
        summary:
          'Engineering is the largest department, with 142 people and 2.8 years of average tenure; Operations has the longest average tenure, at 4.1 years.',
        columns: ['Department', 'Headcount', 'Avg tenure', 'Open roles'],
        rows: [
          ['Engineering', '142', '2.8 yrs', '12'],
          ['Sales', '87', '1.9 yrs', '8'],
          ['Operations', '53', '4.1 yrs', '2'],
          ['Product', '34', '3.2 yrs', '3'],
          ['Marketing', '28', '2.1 yrs', '5'],
        ],
        sql: `SELECT d.name AS "Department",
  COUNT(e.id) AS "Headcount",
  ROUND(AVG((CURRENT_DATE - e.hire_date) / 365.25), 1) || ' yrs' AS "Avg tenure",
  (SELECT COUNT(*) FROM requisitions r
    WHERE r.department_id = d.id AND r.status = 'open') AS "Open roles"
FROM departments d
  JOIN employees e ON e.department_id = d.id AND e.terminated_at IS NULL
GROUP BY d.id, d.name
ORDER BY COUNT(e.id) DESC;`,
        duration: '210ms',
      },
      {
        question: 'Which teams have the highest attrition this year?',
        summary:
          'The SDR team has the highest attrition this year: 9 people have left, against 24 on the team on January 1 (37.5%).',
        columns: ['Team', 'Department', 'Leavers', 'Jan 1 headcount', 'Attrition %'],
        rows: [
          ['SDR', 'Sales', '9', '24', '37.5'],
          ['Field Sales', 'Sales', '6', '31', '19.4'],
          ['Growth Marketing', 'Marketing', '3', '16', '18.8'],
          ['Customer Success', 'Operations', '4', '30', '13.3'],
          ['Platform', 'Engineering', '5', '46', '10.9'],
        ],
        sql: `WITH counts AS (
  SELECT t.name AS team, d.name AS department,
    COUNT(*) FILTER (WHERE e.terminated_at >= date_trunc('year', NOW())) AS leavers,
    COUNT(*) FILTER (WHERE e.hire_date < date_trunc('year', NOW())
      AND (e.terminated_at IS NULL
        OR e.terminated_at >= date_trunc('year', NOW()))) AS jan1_headcount
  FROM teams t
    JOIN departments d ON d.id = t.department_id
    JOIN employees e ON e.team_id = t.id
  GROUP BY t.id, t.name, d.name
)
SELECT team AS "Team", department AS "Department",
  leavers AS "Leavers", jan1_headcount AS "Jan 1 headcount",
  ROUND(leavers * 100.0 / NULLIF(jan1_headcount, 0), 1) AS "Attrition %"
FROM counts
WHERE leavers > 0
ORDER BY "Attrition %" DESC NULLS LAST
LIMIT 5;`,
        duration: '290ms',
      },
      {
        question: 'Compare compensation bands across engineering levels',
        summary:
          'Median base salary rises from $96,500 at L1 to $251,000 at L6, and each band overlaps the next one up.',
        columns: ['Level', 'People', 'Min', 'Median', 'Max'],
        rows: [
          ['L1', '18', '$88,000', '$96,500', '$104,000'],
          ['L2', '36', '$102,000', '$118,000', '$131,000'],
          ['L3', '41', '$128,000', '$146,500', '$162,000'],
          ['L4', '27', '$155,000', '$178,000', '$196,000'],
          ['L5', '14', '$185,000', '$212,000', '$238,000'],
          ['L6', '6', '$225,000', '$251,000', '$280,000'],
        ],
        sql: `SELECT e.level AS "Level",
  COUNT(*) AS "People",
  MIN(c.base_salary) AS "Min",
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY c.base_salary) AS "Median",
  MAX(c.base_salary) AS "Max"
FROM employees e
  JOIN departments d ON d.id = e.department_id
  JOIN compensation c ON c.employee_id = e.id AND c.effective_to IS NULL
WHERE d.name = 'Engineering' AND e.terminated_at IS NULL
GROUP BY e.level
ORDER BY e.level;`,
        duration: '160ms',
      },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    engine: 'PostgreSQL',
    answers: [
      {
        question: 'What is the average resolution time by priority?',
        summary:
          'Over the last 30 days, Critical tickets were resolved fastest (1.4 hours on average) and Low tickets slowest (42.1 hours).',
        columns: ['Priority', 'Resolved tickets', 'Avg resolution', 'SLA met'],
        rows: [
          ['Critical', '24', '1.4 hrs', '92%'],
          ['High', '156', '4.2 hrs', '88%'],
          ['Medium', '410', '18.6 hrs', '95%'],
          ['Low', '283', '42.1 hrs', '97%'],
        ],
        sql: `SELECT t.priority AS "Priority",
  COUNT(*) AS "Resolved tickets",
  ROUND(AVG(EXTRACT(EPOCH FROM (t.resolved_at - t.created_at)) / 3600)::numeric, 1)
    || ' hrs' AS "Avg resolution",
  ROUND(COUNT(*) FILTER (WHERE t.sla_met)::numeric / COUNT(*) * 100)
    || '%' AS "SLA met"
FROM tickets t
WHERE t.resolved_at IS NOT NULL
  AND t.created_at >= NOW() - INTERVAL '30 days'
GROUP BY t.priority
ORDER BY array_position(ARRAY['Critical', 'High', 'Medium', 'Low'], t.priority);`,
        duration: '150ms',
      },
      {
        question: 'Show the busiest support agents this week',
        summary: 'Priya Nair handled the most tickets this week, 64, and resolved 58 of them.',
        columns: ['Agent', 'Tickets', 'Resolved', 'Avg first response'],
        rows: [
          ['Priya Nair', '64', '58', '12 min'],
          ['Marcus Lee', '57', '51', '18 min'],
          ['Sofia Alvarez', '49', '47', '9 min'],
          ['Daniel Kim', '41', '35', '22 min'],
          ['Hana Sato', '38', '36', '14 min'],
        ],
        sql: `SELECT a.name AS "Agent",
  COUNT(*) AS "Tickets",
  COUNT(*) FILTER (WHERE t.resolved_at IS NOT NULL) AS "Resolved",
  ROUND(AVG(EXTRACT(EPOCH FROM (t.first_response_at - t.created_at)) / 60))
    || ' min' AS "Avg first response"
FROM tickets t JOIN agents a ON a.id = t.assignee_id
WHERE t.created_at >= date_trunc('week', NOW())
GROUP BY a.id, a.name
ORDER BY COUNT(*) DESC
LIMIT 5;`,
        duration: '140ms',
      },
      {
        question: 'Which product areas generate the most tickets?',
        summary:
          'Billing generates the most tickets: 248 in the last 30 days (25.8% of all tickets), followed by Integrations with 203.',
        columns: ['Product area', 'Tickets', 'Share'],
        rows: [
          ['Billing', '248', '25.8%'],
          ['Integrations', '203', '21.1%'],
          ['Login and access', '176', '18.3%'],
          ['Reporting', '141', '14.7%'],
          ['Mobile app', '112', '11.7%'],
          ['Other', '81', '8.4%'],
        ],
        sql: `SELECT t.product_area AS "Product area",
  COUNT(*) AS "Tickets",
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) || '%' AS "Share"
FROM tickets t
WHERE t.created_at >= NOW() - INTERVAL '30 days'
GROUP BY t.product_area
ORDER BY COUNT(*) DESC;`,
        duration: '110ms',
      },
    ],
  },
]

// AI mode questions. Each names the sample database Baseil picks for it.
const AI_QUESTIONS: { dbIndex: number; answer: Answer }[] = [
  {
    dbIndex: 0,
    answer: {
      question: 'Which region had the most revenue growth?',
      summary: 'Asia Pacific grew fastest: revenue rose 29.4% last quarter, from $318,900 to $412,600.',
      columns: ['Region', 'Previous quarter', 'Last quarter', 'Growth %'],
      rows: [
        ['Asia Pacific', '$318,900', '$412,600', '+29.4'],
        ['North America', '$1,052,700', '$1,184,300', '+12.5'],
        ['Europe', '$689,400', '$736,800', '+6.9'],
        ['Latin America', '$151,900', '$148,200', '-2.4'],
      ],
      sql: `WITH quarterly AS (
  SELECT c.region,
    SUM(o.total) FILTER (WHERE o.created_at >= date_trunc('quarter', NOW()) - INTERVAL '3 months'
                           AND o.created_at <  date_trunc('quarter', NOW())) AS last_q,
    SUM(o.total) FILTER (WHERE o.created_at >= date_trunc('quarter', NOW()) - INTERVAL '6 months'
                           AND o.created_at <  date_trunc('quarter', NOW()) - INTERVAL '3 months') AS prior_q
  FROM orders o JOIN customers c ON c.id = o.customer_id
  GROUP BY c.region
)
SELECT region AS "Region",
  prior_q AS "Previous quarter",
  last_q AS "Last quarter",
  ROUND((last_q - prior_q) / NULLIF(prior_q, 0) * 100, 1) AS "Growth %"
FROM quarterly
ORDER BY "Growth %" DESC NULLS LAST;`,
      duration: '290ms',
    },
  },
  {
    dbIndex: 1,
    answer: {
      question: 'Which warehouses need restocking this week?',
      summary:
        'Four warehouses have items that will run out within 7 days at the last 4 weeks\' pace; Denver DC needs it most, with 19 SKUs and the first stockout in about a day and a half.',
      columns: ['Warehouse', 'SKUs out within 7 days', 'Soonest stockout'],
      rows: [
        ['Denver DC', '19', '1.5 days'],
        ['Portland DC', '14', '2.0 days'],
        ['Chicago DC', '9', '3.5 days'],
        ['Austin DC', '3', '5.0 days'],
      ],
      sql: `WITH daily AS (
  SELECT warehouse_id, sku_id, SUM(qty) / 28.0 AS per_day
  FROM shipments
  WHERE shipped_at >= NOW() - INTERVAL '28 days'
  GROUP BY warehouse_id, sku_id
)
SELECT w.name AS "Warehouse",
  COUNT(*) AS "SKUs out within 7 days",
  ROUND(MIN(i.qty / d.per_day), 1) || ' days' AS "Soonest stockout"
FROM inventory i
  JOIN daily d ON d.warehouse_id = i.warehouse_id AND d.sku_id = i.sku_id
  JOIN warehouses w ON w.id = i.warehouse_id
WHERE i.qty / d.per_day < 7
GROUP BY w.id, w.name
ORDER BY COUNT(*) DESC;`,
      duration: '370ms',
    },
  },
  {
    dbIndex: 2,
    answer: {
      question: 'Show me attrition rates across departments',
      summary:
        'Sales has the highest attrition: 19 people left in the last 12 months, 22.6% of its average headcount.',
      columns: ['Department', 'Leavers (12 mo)', 'Avg headcount', 'Attrition %'],
      rows: [
        ['Sales', '19', '84', '22.6'],
        ['Marketing', '5', '28', '18.2'],
        ['Operations', '6', '54', '11.1'],
        ['Engineering', '13', '135', '9.6'],
        ['Product', '2', '33', '6.1'],
      ],
      sql: `WITH counts AS (
  SELECT d.name AS department,
    COUNT(*) FILTER (WHERE e.terminated_at >= NOW() - INTERVAL '12 months') AS leavers,
    COUNT(*) FILTER (WHERE e.hire_date <= NOW() - INTERVAL '12 months'
      AND (e.terminated_at IS NULL
        OR e.terminated_at > NOW() - INTERVAL '12 months')) AS start_headcount,
    COUNT(*) FILTER (WHERE e.terminated_at IS NULL) AS headcount
  FROM departments d JOIN employees e ON e.department_id = d.id
  GROUP BY d.id, d.name
)
SELECT department AS "Department",
  leavers AS "Leavers (12 mo)",
  ROUND((start_headcount + headcount) / 2.0) AS "Avg headcount",
  ROUND(leavers * 100.0 / NULLIF((start_headcount + headcount) / 2.0, 0), 1) AS "Attrition %"
FROM counts
ORDER BY "Attrition %" DESC NULLS LAST;`,
      duration: '240ms',
    },
  },
  {
    dbIndex: 3,
    answer: {
      question: 'What is our average ticket resolution time?',
      summary:
        'Over the last 30 days, 873 resolved tickets took 23.2 hours on average, and 94% met their SLA.',
      columns: ['Resolved tickets', 'Avg resolution', 'SLA met'],
      rows: [['873', '23.2 hrs', '94%']],
      sql: `SELECT COUNT(*) AS "Resolved tickets",
  ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600)::numeric, 1)
    || ' hrs' AS "Avg resolution",
  ROUND(COUNT(*) FILTER (WHERE sla_met)::numeric / COUNT(*) * 100)
    || '%' AS "SLA met"
FROM tickets
WHERE resolved_at IS NOT NULL
  AND created_at >= NOW() - INTERVAL '30 days';`,
      duration: '90ms',
    },
  },
]

const LOADING_STEPS = ['Analyzing', 'Selecting tools', 'Building query', 'Executing']
const AI_LOADING_STEPS = ['Understanding intent', 'Scanning databases', 'Selecting source', 'Building query', 'Executing']

export function Sandbox() {
  const [aiMode, setAiMode] = useState(true)
  const [activeDb, setActiveDb] = useState(0)
  // Index of the question being answered or shown, in the current mode's list.
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [activeTab, setActiveTab] = useState<'results' | 'sql'>('results')
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [consoleGlow, setConsoleGlow] = useState(false)
  const [activeLoadingStep, setActiveLoadingStep] = useState(-1)
  const hasTrackedRef = useRef(false)
  const answerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const steps = aiMode ? AI_LOADING_STEPS : LOADING_STEPS
  const currentAnswers = aiMode ? AI_QUESTIONS.map(q => q.answer) : DATABASES[activeDb].answers
  const answer = activeQuestion === null ? null : currentAnswers[activeQuestion]
  const sourceDb = aiMode && activeQuestion !== null ? DATABASES[AI_QUESTIONS[activeQuestion].dbIndex] : null

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (!hasTrackedRef.current) {
            trackEvent('section_view', { section_name: 'sandbox' })
            hasTrackedRef.current = true
          }
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

  useEffect(() => () => {
    if (answerTimerRef.current) clearTimeout(answerTimerRef.current)
  }, [])

  const clearAnswerTimer = () => {
    if (answerTimerRef.current) {
      clearTimeout(answerTimerRef.current)
      answerTimerRef.current = null
    }
  }

  const runQuery = (index: number) => {
    trackEvent('sandbox_interact', { action: 'run_query' })
    clearAnswerTimer()
    setActiveQuestion(index)
    setLoading(true)
    setShowResult(false)
    setActiveTab('results')

    answerTimerRef.current = setTimeout(() => {
      answerTimerRef.current = null
      setLoading(false)
      setShowResult(true)
    }, aiMode ? 3800 : 3500)
  }

  const reset = () => {
    clearAnswerTimer()
    setActiveQuestion(null)
    setShowResult(false)
    setLoading(false)
  }

  const switchDb = (index: number) => {
    trackEvent('sandbox_interact', { action: 'switch_database', database: DATABASES[index].id })
    setActiveDb(index)
    setAiMode(false)
    reset()
  }

  const switchToAi = () => {
    trackEvent('sandbox_interact', { action: 'toggle_ai_mode' })
    setAiMode(true)
    reset()
  }

  const rowCount = answer ? answer.rows.length : 0

  return (
    <section id="sandbox" ref={sectionRef} className="relative py-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,_rgba(82,183,136,0.04)_0%,_transparent_60%)]" />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section label */}
        <div className="text-center mb-14">
          <span className="text-[0.7rem] font-[var(--font-outfit)] uppercase tracking-[0.2em] text-[#52B788]/50 mb-4 block">
            Demo
          </span>
          <h2 className="font-[var(--font-newsreader)] text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#C8D8C4] leading-tight mb-3">
            Try it yourself.
          </h2>
          <p className="font-[var(--font-outfit)] text-[0.95rem] text-[#5A7A58]">
            Sample questions on a sample database. These answers are pre-recorded; install Baseil to ask your own.
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
            {(loading || showResult) && answer && (
              <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl bg-[#0A0F0D]/60 border border-[#52B788]/8">
                {loading && <Loader2 size={14} className="text-[#52B788] animate-spin shrink-0" />}
                <span className="text-[0.9rem] font-[var(--font-outfit)] text-[#C8D8C4]">{answer.question}</span>
              </div>
            )}

            {/* Clickable query suggestions */}
            {!loading && (
              <div>
                <p className="text-[0.72rem] font-[var(--font-outfit)] text-[#3D5A3A] mb-3">
                  {showResult ? 'Try another question:' : 'Click a question to try it:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentAnswers.map((a, i) => {
                    const isActive = showResult && activeQuestion === i
                    return (
                      <button
                        key={`${aiMode}-${i}`}
                        onClick={() => { trackEvent('sandbox_interact', { action: 'select_query' }); runQuery(i) }}
                        aria-pressed={isActive}
                        className={`flex items-center gap-1.5 text-[0.78rem] font-[var(--font-outfit)] px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'bg-[#52B788]/[0.12] border-[#52B788]/30 text-[#C8D8C4]'
                            : 'bg-[#52B788]/[0.04] border-[#52B788]/[0.08] text-[#8FAF8A] hover:text-[#C8D8C4] hover:border-[#52B788]/20 hover:bg-[#52B788]/[0.08]'
                        }`}
                      >
                        <ChevronRight size={12} className={isActive ? 'text-[#52B788]' : 'text-[#52B788]/50'} />
                        {a.question}
                      </button>
                    )
                  })}
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
          {showResult && answer && (
            <div className="border-t border-[#52B788]/[0.06]">
              {/* Source badge for AI mode */}
              {sourceDb && (
                <div className="px-5 pt-3 pb-0 flex items-center gap-2">
                  <span className="text-[0.65rem] font-[var(--font-outfit)] text-[#3D5A3A]">Source detected:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-[#52B788]/15 bg-[#52B788]/[0.06] text-[0.68rem] font-[var(--font-outfit)] text-[#52B788]/80">
                    <Database size={10} />
                    {sourceDb.label}
                    <span className="text-[#52B788]/40">{sourceDb.engine}</span>
                  </span>
                </div>
              )}

              {/* One-sentence answer */}
              <p className="px-5 pt-4 pb-1 text-[0.9rem] font-[var(--font-outfit)] text-[#C8D8C4] leading-relaxed">
                {answer.summary}
              </p>

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
                  <span className="flex items-center gap-1"><Clock size={11} />{answer.duration}</span>
                  <span className="flex items-center gap-1"><TableIcon size={11} />{rowCount} {rowCount === 1 ? 'row' : 'rows'}</span>
                </div>
              </div>

              {activeTab === 'results' && (
                <div className="p-5 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        {answer.columns.map((col, i) => (
                          <th key={i} className="text-left text-[0.7rem] font-[var(--font-outfit)] font-medium text-[#5A7A58] uppercase tracking-wider pb-3 pr-6">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {answer.rows.map((row, i) => (
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
                    {answer.sql}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nudge CTA */}
        <div className="text-center mt-8">
          <a
            href="/docs/quickstart"
            onClick={() => trackEvent('cta_click', { button_label: 'want_on_your_data', section: 'sandbox' })}
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
