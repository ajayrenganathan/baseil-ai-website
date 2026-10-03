// The sample store database behind the landing hero and /scroll. Every dot
// either page draws is one row of it, and every figure they show is computed
// here: the counts, the join path (a breadth-first search over the foreign
// keys), the SQL built from that path, and the answers (from seeded rows,
// identical on server and client).

export type TableName =
  | 'regions'
  | 'customers'
  | 'cust_xref'
  | 'orders'
  | 'order_lines'
  | 'products'
  | 'categories'
  | 'suppliers'
  | 'inventory'
  | 'returns'
  | 'shipments'
  | 'payments'
  | 'ord_hdr_bak'
  | 'tmp_import_2019'

export interface Table {
  name: TableName
  alias: string
  columns: string[]
  /** Leftovers with no relationships. */
  legacy?: boolean
}

export interface ForeignKey {
  table: TableName
  column: string
  references: TableName
}

export const TABLES: Table[] = [
  { name: 'categories', alias: 'c', columns: ['id', 'name', 'slug'] },
  { name: 'cust_xref', alias: 'cx', columns: ['legacy_id', 'customer_id', 'source'] },
  { name: 'customers', alias: 'cu', columns: ['id', 'name', 'email', 'region_id', 'segment', 'created_at'] },
  { name: 'inventory', alias: 'i', columns: ['product_id', 'warehouse', 'qty_on_hand', 'updated_at'] },
  { name: 'ord_hdr_bak', alias: 'ob', columns: ['ord_no', 'cust', 'amt', 'dt'], legacy: true },
  { name: 'order_lines', alias: 'ol', columns: ['id', 'order_id', 'product_id', 'qty', 'unit_price'] },
  { name: 'orders', alias: 'o', columns: ['id', 'customer_id', 'status', 'total', 'currency', 'created_at'] },
  { name: 'payments', alias: 'pm', columns: ['id', 'order_id', 'method', 'amount', 'captured_at'] },
  { name: 'products', alias: 'p', columns: ['id', 'sku', 'name', 'category_id', 'supplier_id', 'price'] },
  { name: 'regions', alias: 'rg', columns: ['id', 'name', 'created_at'] },
  { name: 'returns', alias: 'r', columns: ['id', 'order_line_id', 'reason', 'refund_amount', 'created_at'] },
  { name: 'shipments', alias: 's', columns: ['id', 'order_id', 'carrier', 'promised_at', 'delivered_at'] },
  { name: 'suppliers', alias: 'su', columns: ['id', 'name', 'country'] },
  { name: 'tmp_import_2019', alias: 't', columns: ['col_a', 'col_b', 'col_c', 'loaded_at'], legacy: true },
]

export const FOREIGN_KEYS: ForeignKey[] = [
  { table: 'orders', column: 'customer_id', references: 'customers' },
  { table: 'order_lines', column: 'order_id', references: 'orders' },
  { table: 'shipments', column: 'order_id', references: 'orders' },
  { table: 'payments', column: 'order_id', references: 'orders' },
  { table: 'customers', column: 'region_id', references: 'regions' },
  { table: 'cust_xref', column: 'customer_id', references: 'customers' },
  { table: 'order_lines', column: 'product_id', references: 'products' },
  { table: 'returns', column: 'order_line_id', references: 'order_lines' },
  { table: 'products', column: 'category_id', references: 'categories' },
  { table: 'products', column: 'supplier_id', references: 'suppliers' },
  { table: 'inventory', column: 'product_id', references: 'products' },
]

const TABLE_BY_NAME = new Map(TABLES.map((t) => [t.name, t]))

export const alias = (name: TableName) => TABLE_BY_NAME.get(name)!.alias

// ---- graph ------------------------------------------------------------------

function neighbours(name: TableName): TableName[] {
  const out: TableName[] = []
  for (const fk of FOREIGN_KEYS) {
    if (fk.table === name) out.push(fk.references)
    else if (fk.references === name) out.push(fk.table)
  }
  return out
}

/** Shortest join path between two tables, following foreign keys either way. */
export function joinPath(from: TableName, to: TableName): TableName[] {
  const prev = new Map<TableName, TableName | null>([[from, null]])
  const queue: TableName[] = [from]
  while (queue.length) {
    const at = queue.shift()!
    if (at === to) break
    for (const next of neighbours(at)) {
      if (!prev.has(next)) {
        prev.set(next, at)
        queue.push(next)
      }
    }
  }
  if (!prev.has(to)) return []
  const path: TableName[] = []
  for (let t: TableName | null = to; t; t = prev.get(t) ?? null) path.unshift(t)
  return path
}

/** The order discovery reaches tables in, spreading out from the busiest one. */
export function discoveryOrder(start: TableName = 'orders'): TableName[] {
  const seen = new Set<TableName>([start])
  const order: TableName[] = [start]
  for (let i = 0; i < order.length; i++) {
    for (const next of neighbours(order[i])) {
      if (!seen.has(next)) {
        seen.add(next)
        order.push(next)
      }
    }
  }
  for (const t of TABLES) if (!seen.has(t.name)) order.push(t.name)
  return order
}

// ---- sample rows --------------------------------------------------------------

// mulberry32: a tiny seeded PRNG, so the server render and the browser agree.
export function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const CATEGORIES = ['Apparel', 'Footwear', 'Electronics', 'Home', 'Outdoor', 'Beauty']
const CATEGORY_RETURN = [0.22, 0.19, 0.08, 0.07, 0.05, 0.04]
const CATEGORY_PRICE = [42, 88, 210, 64, 120, 26]

function generate() {
  const r = rng(20261003)
  const products = Array.from({ length: 24 }, (_, id) => {
    const category = id % CATEGORIES.length
    return { id, category, price: Math.round(CATEGORY_PRICE[category] * (0.7 + r() * 0.6)) }
  })
  const lines: { order: number; category: number; price: number; returned: boolean }[] = []
  const orders = 280
  for (let order = 0; order < orders; order++) {
    const count = 1 + Math.floor(r() * 3)
    for (let k = 0; k < count; k++) {
      const product = products[Math.floor(r() * products.length)]
      lines.push({
        order,
        category: product.category,
        price: product.price,
        returned: r() < CATEGORY_RETURN[product.category],
      })
    }
  }
  return { products, orders, lines }
}

const DATA = generate()

/** One entry per row of the sample. Tables the answer does not read carry only a count. */
export interface Row {
  table: TableName
  /** order_lines: index into CATEGORIES. */
  category?: number
  /** order_lines: whether this line has a matching row in returns. */
  returned?: boolean
  /** returns: index (within ROWS) of the order line it points at. */
  line?: number
}

const ROW_COUNTS: Record<TableName, number> = {
  regions: 4,
  customers: 64,
  cust_xref: 40,
  orders: DATA.orders,
  order_lines: DATA.lines.length,
  products: DATA.products.length,
  categories: CATEGORIES.length,
  suppliers: 6,
  inventory: DATA.products.length,
  returns: DATA.lines.filter((l) => l.returned).length,
  shipments: DATA.orders,
  payments: DATA.orders,
  ord_hdr_bak: 120,
  tmp_import_2019: 36,
}

function buildRows(): Row[] {
  const rows: Row[] = []
  const lineStart = new Map<TableName, number>()
  for (const t of TABLES) {
    lineStart.set(t.name, rows.length)
    if (t.name === 'order_lines') {
      for (const l of DATA.lines) rows.push({ table: t.name, category: l.category, returned: l.returned })
    } else if (t.name !== 'returns') {
      for (let i = 0; i < ROW_COUNTS[t.name]; i++) rows.push({ table: t.name })
    }
  }
  // Returns last, so each can point at its order line by index.
  const first = lineStart.get('order_lines')!
  DATA.lines.forEach((l, i) => {
    if (l.returned) rows.push({ table: 'returns', line: first + i })
  })
  return rows
}

export const ROWS = buildRows()

export const SCHEMA_TOTALS = {
  tables: TABLES.length,
  columns: TABLES.reduce((n, t) => n + t.columns.length, 0),
  relationships: FOREIGN_KEYS.length,
  rows: ROWS.length,
}

// ---- the question ---------------------------------------------------------------

export const QUESTION = {
  text: 'Which product categories get returned the most?',
  from: 'categories' as TableName,
  to: 'returns' as TableName,
  select: [
    'c.name AS category',
    'COUNT(ol.id) AS lines',
    'COUNT(r.id) AS returns',
    'ROUND(100.0 * COUNT(r.id) / COUNT(ol.id), 1) AS return_rate',
  ],
  joinKind: { returns: 'LEFT JOIN' } as Partial<Record<TableName, string>>,
  tail: ['GROUP BY c.name', 'ORDER BY returns DESC'],
}

/** Every category with its lines and returns, most returned first. */
export const ANSWER = CATEGORIES.map((name, category) => {
  const lines = DATA.lines.filter((l) => l.category === category)
  return { name, category, lines: lines.length, returns: lines.filter((l) => l.returned).length }
}).sort((a, b) => b.returns - a.returns)

function onClause(prev: TableName, next: TableName): string {
  const fk = FOREIGN_KEYS.find(
    (k) => (k.table === next && k.references === prev) || (k.table === prev && k.references === next),
  )!
  return fk.table === next
    ? `${alias(next)}.${fk.column} = ${alias(prev)}.id`
    : `${alias(next)}.id = ${alias(prev)}.${fk.column}`
}

/** The SQL for QUESTION, one entry per line, with the joins built from the path. */
export function querySql() {
  const path = joinPath(QUESTION.from, QUESTION.to)
  const lines: { text: string; kind: 'select' | 'from' | 'join' | 'tail' }[] = QUESTION.select.map((s, i) => ({
    text: `${i === 0 ? 'SELECT ' : '       '}${s}${i < QUESTION.select.length - 1 ? ',' : ''}`,
    kind: 'select' as const,
  }))
  lines.push({ text: `FROM ${path[0]} ${alias(path[0])}`, kind: 'from' })
  for (let i = 1; i < path.length; i++) {
    const kind = QUESTION.joinKind[path[i]] ?? 'JOIN'
    lines.push({ text: `${kind} ${path[i]} ${alias(path[i])} ON ${onClause(path[i - 1], path[i])}`, kind: 'join' })
  }
  QUESTION.tail.forEach((t, i) =>
    lines.push({ text: i === QUESTION.tail.length - 1 ? `${t};` : t, kind: 'tail' }),
  )
  return { path, lines }
}

// ---- insights ---------------------------------------------------------------

/**
 * Questions a store owner would ask, answered from the same seeded rows. The
 * landing hero shows each as a key figure and a short label inside its hover
 * bubble. Every figure is computed, not invented.
 */
export interface Insight {
  figure: string
  label: string
}

export const INSIGHTS: Insight[] = (() => {
  const pct = (x: number) => `${Math.round(x * 100)}%`
  const money = (n: number) => `$${new Intl.NumberFormat('en-US').format(Math.round(n))}`
  const revenue = DATA.lines.reduce((sum, l) => sum + l.price, 0)
  const byRevenue = CATEGORIES.map((name, category) => ({
    name,
    share: DATA.lines.filter((l) => l.category === category).reduce((sum, l) => sum + l.price, 0) / revenue,
  })).sort((a, b) => b.share - a.share)
  const returned = DATA.lines.filter((l) => l.returned)
  const refunds = returned.reduce((sum, l) => sum + l.price, 0)
  const ordersWithReturn = new Set(returned.map((l) => l.order)).size
  const most = ANSWER[0]
  const least = ANSWER[ANSWER.length - 1]
  return [
    // Which category gets returned most?
    {
      figure: pct(most.returns / most.lines),
      label: `${most.name} lines returned`,
    },
    // Where do most sales come from?
    {
      figure: pct(byRevenue[0].share),
      label: `of revenue is ${byRevenue[0].name}`,
    },
    // What does a typical order look like?
    {
      figure: money(revenue / DATA.orders),
      label: 'a typical order',
    },
    // How many orders see a return?
    {
      figure: pct(ordersWithReturn / DATA.orders),
      label: 'of orders see a return',
    },
    // What are returns costing us?
    {
      figure: money(refunds),
      label: 'lost to refunds',
    },
    // Which category sells cleanest?
    {
      figure: pct(least.returns / least.lines),
      label: `${least.name} return rate`,
    },
  ]
})()
