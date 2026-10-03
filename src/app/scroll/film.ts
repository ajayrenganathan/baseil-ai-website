import type { ScrollCraftApi } from './engine/scrollcraft'
import { ANSWER, FOREIGN_KEYS, ROWS, TABLES, discoveryOrder, joinPath, QUESTION, type TableName } from '@/lib/sample-db'
import { LEAF_SHADES, sampleLeaf, type LeafPoints } from '@/lib/leaf'

// The particle film behind /scroll. Every dot is one row of the sample
// database. Scroll position picks a point on a timeline of layouts (a cloud,
// the tables, the question, the join, the answer chart, the Baseil leaf) and
// each dot travels between them in true perspective. Scroll only ever writes a
// target; the film glides toward it every frame, the same playhead-lerp the
// scroll-craft engine uses for video, so an uneven wheel still reads as a
// glide. Dots are drawn in batches by colour and opacity, so a frame costs a
// handful of fills however many rows there are.

const F = 1000 // focal length in px: a point at depth F draws at scale 1
const TAU = Math.PI * 2
const N = ROWS.length

const CLOUD = 0
const DEEP = 1
const MAP = 2
const QUIET = 3
const JOIN = 4
const BARS = 5
const LEAF = 6

const INK = 0
const ACCENT = 1
const BASE_PALETTE = ['rgb(211,223,207)', 'rgb(82,183,136)']

interface Camera {
  x: number
  y: number
  z: number
  tilt: number
}

interface Layout {
  x: Float32Array
  y: Float32Array
  z: Float32Array
  a: Float32Array
  r: Float32Array
  c: Uint8Array
  /** Width over height of each mark: rows are strips, the leaf is dots. */
  shape: number
  cam: Camera
}

type ActRef = [id: string, p: number]
interface SegmentSpec {
  from: ActRef
  to: ActRef
  a: number
  b: number
  /** Per-dot head start, as a share of the move. 0 moves every dot together. */
  stagger: number
}

// The film, in scroll order. A segment with a === b is a hold.
const SPEC: SegmentSpec[] = [
  { from: ['hero', 0], to: ['hero', 0.1], a: CLOUD, b: CLOUD, stagger: 0 },
  { from: ['hero', 0.1], to: ['hero', 0.8], a: CLOUD, b: DEEP, stagger: 0 },
  { from: ['hero', 0.8], to: ['map', 0.32], a: DEEP, b: MAP, stagger: 0.5 },
  { from: ['map', 0.32], to: ['map', 0.82], a: MAP, b: MAP, stagger: 0 },
  { from: ['map', 0.82], to: ['ask', 0.22], a: MAP, b: QUIET, stagger: 0 },
  { from: ['ask', 0.22], to: ['ask', 0.8], a: QUIET, b: QUIET, stagger: 0 },
  { from: ['ask', 0.8], to: ['answer', 0.16], a: QUIET, b: JOIN, stagger: 0.45 },
  { from: ['answer', 0.16], to: ['answer', 0.24], a: JOIN, b: JOIN, stagger: 0 },
  { from: ['answer', 0.24], to: ['answer', 0.62], a: JOIN, b: BARS, stagger: 0.55 },
  { from: ['answer', 0.62], to: ['answer', 1], a: BARS, b: BARS, stagger: 0 },
  { from: ['answer', 1], to: ['close', 0.42], a: BARS, b: LEAF, stagger: 0.45 },
  { from: ['close', 0.42], to: ['close', 1], a: LEAF, b: LEAF, stagger: 0 },
]

// Block positions for the map, normalised 0..1, laid out like a transit map:
// every relationship is a straight run and the leftovers sit apart.
const GRID_WIDE: Record<TableName, [number, number]> = {
  cust_xref: [1 / 3, 0], shipments: [2 / 3, 0], ord_hdr_bak: [1, 0],
  regions: [0, 1 / 3], customers: [1 / 3, 1 / 3], orders: [2 / 3, 1 / 3], payments: [1, 1 / 3],
  categories: [0, 2 / 3], products: [1 / 3, 2 / 3], order_lines: [2 / 3, 2 / 3], returns: [1, 2 / 3],
  inventory: [0, 1], suppliers: [1 / 3, 1], tmp_import_2019: [1, 1],
}
const GRID_PHONE: Record<TableName, [number, number]> = {
  regions: [0, 0], customers: [0.5, 0], cust_xref: [1, 0],
  payments: [0, 0.25], orders: [0.5, 0.25], shipments: [1, 0.25],
  ord_hdr_bak: [0, 0.5], order_lines: [0.5, 0.5], returns: [1, 0.5],
  categories: [0, 0.75], products: [0.5, 0.75], inventory: [1, 0.75],
  tmp_import_2019: [0, 1], suppliers: [0.5, 1],
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const smooth = (x: number) => {
  x = clamp01(x)
  return x * x * (3 - 2 * x)
}
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// Per-dot facts that do not depend on the viewport.
const RANK = new Map(discoveryOrder().map((t, i) => [t, i]))
const PATH = joinPath(QUESTION.from, QUESTION.to)
const LEGACY = new Set(TABLES.filter((t) => t.legacy).map((t) => t.name))
const seedA = new Float32Array(N)
const seedB = new Float32Array(N)
const seedC = new Float32Array(N)
const indexInTable = new Int32Array(N)
{
  let s = 7
  const next = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  const seen = new Map<TableName, number>()
  ROWS.forEach((row, i) => {
    seedA[i] = next()
    seedB[i] = next()
    seedC[i] = next()
    const k = seen.get(row.table) ?? 0
    indexInTable[i] = k
    seen.set(row.table, k + 1)
  })
}
const TABLE_SIZE = new Map<TableName, number>()
for (const row of ROWS) TABLE_SIZE.set(row.table, (TABLE_SIZE.get(row.table) ?? 0) + 1)

// Where each order line sits in the answer chart: its column (categories by
// returns, most first) and its place in the stack (returned lines at the base).
const CHART_COLUMN = new Map(ANSWER.map((c, col) => [c.category, col]))
const chartSlot = new Int32Array(N).fill(-1)
{
  const filled = ANSWER.map(() => 0)
  const order = ROWS.map((row, i) => i).filter((i) => ROWS[i].table === 'order_lines')
  order.sort((i, j) => Number(ROWS[j].returned) - Number(ROWS[i].returned))
  for (const i of order) {
    const col = CHART_COLUMN.get(ROWS[i].category!)!
    chartSlot[i] = filled[col]++
  }
}
const MAX_LINES = Math.max(...ANSWER.map((c) => c.lines))

// How much of a head start each dot gets in each staggered move, 0..1.
const DELAYS = new Map<string, Float32Array>()
{
  const make = (fn: (i: number) => number) => Float32Array.from({ length: N }, (_, i) => fn(i))
  // Tables surface in the order discovery reaches them.
  DELAYS.set(`${DEEP}>${MAP}`, make((i) => (RANK.get(ROWS[i].table)! / (TABLES.length - 1)) * 0.65 + seedA[i] * 0.35))
  // Returns leave for their order lines one by one; nothing else moves.
  DELAYS.set(`${QUIET}>${JOIN}`, make((i) => (ROWS[i].table === 'returns' ? seedA[i] : 0)))
  // The answer fills column by column, bottom to top, like a wave.
  DELAYS.set(
    `${JOIN}>${BARS}`,
    make((i) => {
      const row = ROWS[i]
      if (chartSlot[i] < 0 && row.table !== 'returns') return seedA[i] * 0.5
      const line = row.table === 'returns' ? row.line! : i
      const col = CHART_COLUMN.get(ROWS[line].category!)!
      return (col / (ANSWER.length - 1)) * 0.45 + (chartSlot[line] / MAX_LINES) * 0.3 + seedB[line] * 0.25
    }),
  )
  DELAYS.set(`${BARS}>${LEAF}`, make((i) => seedA[i]))
}

interface Geometry {
  W: number
  H: number
  phone: boolean
  blocks: Map<TableName, { x: number; y: number; w: number; h: number }>
  chart: { x0: number; base: number; bar: number; gap: number; step: number; per: number }
  leaf: { x: number; y: number }
}

function makeLayout(cam: Camera, shape: number): Layout {
  return {
    x: new Float32Array(N),
    y: new Float32Array(N),
    z: new Float32Array(N),
    a: new Float32Array(N),
    r: new Float32Array(N),
    c: new Uint8Array(N),
    shape,
    cam,
  }
}

function build(W: number, H: number, leafPoints: LeafPoints | null) {
  const phone = W < 760
  const layouts: Layout[] = []

  // 1. The cloud: a long tunnel of rows. Far rows gather at the vanishing
  // point; as the camera flies in they stream outward past the edges.
  const cloud = makeLayout({ x: 0, y: 0, z: 0, tilt: 0 }, 3)
  for (let i = 0; i < N; i++) {
    cloud.x[i] = (seedB[i] * 2 - 1) * W * 0.7
    cloud.y[i] = (seedC[i] * 2 - 1) * H * 0.7
    cloud.z[i] = F * (0.3 + 5.2 * Math.pow(seedA[i], 1.05))
    cloud.a[i] = 0.95
    cloud.r[i] = phone ? 1.3 : 1.9
    // The answer is already in there: returned lines glow faintly from the start.
    cloud.c[i] = ROWS[i].returned ? ACCENT : INK
  }
  layouts[CLOUD] = cloud

  // 2. The same cloud, with the camera flown deep into it.
  layouts[DEEP] = { ...cloud, cam: { x: 0, y: 0, z: F * 2.3, tilt: 0.06 } }

  // 3. The map: one block of dots per table.
  const grid = phone ? GRID_PHONE : GRID_WIDE
  const regionW = phone ? W * 0.86 : Math.min(W * 0.78, 1100)
  const regionH = phone ? Math.min(H * 0.5, 420) : Math.min(H * 0.58, 520)
  const offsetY = phone ? -H * 0.1 : -H * 0.08
  // A row strip is ROW_PITCH steps wide and one step tall.
  const ROW_PITCH = 2.8
  const cols = (n: number) => Math.ceil(Math.sqrt(n * 0.9))
  const cellW = phone ? regionW / 2 : regionW / 3
  const cellH = phone ? regionH / 4 : regionH / 3
  const biggest = Math.max(...TABLE_SIZE.values())
  const step = Math.min(
    (cellW * 0.84) / (cols(biggest) * ROW_PITCH),
    (cellH * 0.62) / Math.ceil(biggest / cols(biggest)),
  )
  const blocks = new Map<TableName, { x: number; y: number; w: number; h: number }>()
  for (const t of TABLES) {
    const n = TABLE_SIZE.get(t.name) ?? 0
    const c = Math.min(cols(n), n)
    const [gx, gy] = grid[t.name]
    blocks.set(t.name, {
      x: (gx - 0.5) * regionW,
      y: (gy - 0.5) * regionH + offsetY,
      w: c * step * ROW_PITCH,
      h: Math.ceil(n / c) * step,
    })
  }
  const stripShape = (ROW_PITCH * 0.82) / 0.62
  const map = makeLayout(
    phone ? { x: 0, y: 0, z: 0, tilt: 0.42 } : { x: 0, y: -H * 0.02, z: F * 0.16, tilt: 0.5 },
    stripShape,
  )
  for (let i = 0; i < N; i++) {
    const t = ROWS[i].table
    const b = blocks.get(t)!
    const c = Math.min(cols(TABLE_SIZE.get(t)!), TABLE_SIZE.get(t)!)
    const k = indexInTable[i]
    map.x[i] = b.x - b.w / 2 + (k % c) * step * ROW_PITCH + (step * ROW_PITCH) / 2
    map.y[i] = b.y - b.h / 2 + Math.floor(k / c) * step + step / 2
    map.z[i] = F
    map.a[i] = LEGACY.has(t) ? 0.4 : 0.85
    map.r[i] = step * 0.31
    map.c[i] = INK
  }
  layouts[MAP] = map

  // 4. Quiet: the map recedes and the lights go down before the question.
  const quiet = makeLayout({ x: 0, y: -H * 0.06, z: -F * 0.5, tilt: 0.9 }, stripShape)
  quiet.x.set(map.x)
  quiet.y.set(map.y)
  quiet.z.set(map.z)
  quiet.r.set(map.r)
  for (let i = 0; i < N; i++) quiet.a[i] = map.a[i] * 0.22
  layouts[QUIET] = quiet

  // 5. The join: every return finds its order line, and the path lights up.
  const pathY = PATH.reduce((sum, t) => sum + blocks.get(t)!.y, 0) / PATH.length
  const join = makeLayout(
    phone ? { x: 0, y: pathY * 0.5, z: F * 0.04, tilt: 0.3 } : { x: 0, y: pathY * 0.9, z: F * 0.32, tilt: 0.3 },
    stripShape,
  )
  for (let i = 0; i < N; i++) {
    const row = ROWS[i]
    const on = PATH.includes(row.table)
    const src = row.table === 'returns' ? row.line! : i
    join.x[i] = map.x[src]
    join.y[i] = map.y[src]
    join.z[i] = F
    join.r[i] = map.r[i] * (row.table === 'returns' ? 1.25 : 1)
    join.a[i] = on ? 1 : 0.2
    join.c[i] = row.returned || row.table === 'returns' ? ACCENT : INK
  }
  layouts[JOIN] = join

  // 6. The answer: every order line flies into its category's stack.
  const per = 2
  const levels = Math.ceil(MAX_LINES / per)
  const chartW = phone ? W * 0.9 : Math.min(W * 0.52, 760)
  const gapShare = phone ? 0.3 : 0.55
  const bar = chartW / (ANSWER.length + (ANSWER.length - 1) * gapShare)
  const gap = bar * gapShare
  const chartStep = Math.min(phone ? 4.5 : 7, (H * (phone ? 0.27 : 0.38)) / levels)
  const chart = { x0: -chartW / 2, base: phone ? -H * 0.02 : H * 0.1, bar, gap, step: chartStep, per }
  const barShape = ((bar / per) * 0.86) / (chartStep * 0.64)
  const bars = makeLayout({ x: 0, y: 0, z: 0, tilt: 0 }, barShape)
  for (let i = 0; i < N; i++) {
    const row = ROWS[i]
    if (row.table === 'order_lines') {
      const col = CHART_COLUMN.get(row.category!)!
      const slot = chartSlot[i]
      bars.x[i] = chart.x0 + col * (bar + gap) + ((slot % per) + 0.5) * (bar / per)
      bars.y[i] = chart.base - Math.floor(slot / per) * chartStep - chartStep / 2
      bars.z[i] = F
      bars.r[i] = chartStep * 0.32
      bars.a[i] = row.returned ? 1 : 0.17
      bars.c[i] = row.returned ? ACCENT : INK
    } else if (row.table === 'returns') {
      // A return travels with its line and merges into it.
      const line = row.line!
      const col = CHART_COLUMN.get(ROWS[line].category!)!
      const slot = chartSlot[line]
      bars.x[i] = chart.x0 + col * (bar + gap) + ((slot % per) + 0.5) * (bar / per)
      bars.y[i] = chart.base - Math.floor(slot / per) * chartStep - chartStep / 2
      bars.z[i] = F
      bars.r[i] = chartStep * 0.32
      bars.a[i] = 0
      bars.c[i] = ACCENT
    } else {
      // Everything the answer did not need sinks away.
      bars.x[i] = map.x[i]
      bars.y[i] = map.y[i] + H * 0.4
      bars.z[i] = F * 1.9
      bars.r[i] = map.r[i]
      bars.a[i] = 0.05
      bars.c[i] = INK
    }
  }
  layouts[BARS] = bars

  // 7. The close: every row becomes the Baseil leaf.
  const leafH = leafHeight(W, H)
  const leaf = { x: 0, y: phone ? H * 0.36 - leafH / 2 - H / 2 : -H * 0.17 }
  const leafLayout = makeLayout({ x: 0, y: 0, z: 0, tilt: 0 }, 1)
  for (let i = 0; i < N; i++) {
    if (leafPoints && leafPoints.x.length) {
      const k = Math.floor(seedA[i] * leafPoints.x.length)
      leafLayout.x[i] = leaf.x + leafPoints.x[k] + (seedB[i] - 0.5) * 1.5
      leafLayout.y[i] = leaf.y + leafPoints.y[k] + (seedC[i] - 0.5) * 1.5
      leafLayout.c[i] = 2 + leafPoints.shade[k]
    } else {
      // Until the leaf image has loaded, a soft disc holds its place.
      const ang = seedA[i] * TAU
      const rad = Math.sqrt(seedB[i]) * Math.min(W, H) * 0.16
      leafLayout.x[i] = leaf.x + Math.cos(ang) * rad
      leafLayout.y[i] = leaf.y + Math.sin(ang) * rad
      leafLayout.c[i] = ACCENT
    }
    leafLayout.z[i] = F
    leafLayout.r[i] = phone ? 1.3 : 1.7
    leafLayout.a[i] = 0.92
  }
  layouts[LEAF] = leafLayout

  const geometry: Geometry = { W, H, phone, blocks, chart, leaf }
  return { layouts, geometry }
}

// ---- the leaf ---------------------------------------------------------------

/** On phones the leaf is capped by width too, so it never reaches the closing text. */
const leafHeight = (W: number, H: number) => (W < 760 ? Math.min(H * 0.2, W * 0.3) : H * 0.34)

// ---- the film ---------------------------------------------------------------

export interface FilmOptions {
  back: HTMLCanvasElement
  front: HTMLCanvasElement
  /** Gets data-sc-verify-state, so the scroll-craft harness can see the film change. */
  film: HTMLElement
  api: ScrollCraftApi
  reduce: boolean
  leafSrc: string
}

export function startFilm({ back, front, film, api, reduce, leafSrc }: FilmOptions): () => void {
  const bctx = back.getContext('2d')!
  const fctx = front.getContext('2d')!
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
  const css = getComputedStyle(document.body)
  const serif = css.getPropertyValue('--font-newsreader').trim() || 'Georgia, serif'
  const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace'

  let W = 0
  let H = 0
  let layouts: Layout[] = []
  let geo: Geometry
  let leafPoints: LeafPoints | null = null
  let leafImg: HTMLImageElement | null = null
  let palette = [...BASE_PALETTE]
  let segments: { from: number; to: number; a: number; b: number; stagger: number }[] = []

  // Scratch space for one frame.
  const px = new Float32Array(N)
  const py = new Float32Array(N)
  const pr = new Float32Array(N)
  const pw = new Float32Array(N)
  const tx = new Float32Array(N)
  const ty = new Float32Array(N)
  let streaking = false
  const BUCKETS = 2 * (2 + LEAF_SHADES) * 8
  const bucketItems = Array.from({ length: BUCKETS }, () => new Int32Array(N))
  const bucketCount = new Int32Array(BUCKETS)

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2)
    W = innerWidth
    H = innerHeight
    for (const c of [back, front]) {
      c.width = Math.round(W * dpr)
      c.height = Math.round(H * dpr)
    }
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (leafImg) {
      leafPoints = sampleLeaf(leafImg, leafHeight(W, H), N)
      palette = [...BASE_PALETTE, ...leafPoints.palette]
    }
    ;({ layouts, geometry: geo } = build(W, H, leafPoints))
  }

  function locate(y: number) {
    const Y = (ref: ActRef) => {
      const act = api.acts.find((a) => a.el.id === ref[0])
      return act ? act.top + ref[1] * Math.max(act.height - H, 1) : 0
    }
    segments = SPEC.map((s) => ({ from: Y(s.from), to: Y(s.to), a: s.a, b: s.b, stagger: s.stagger }))
    let i = 0
    while (i < segments.length - 1 && y > segments[i].to) i++
    const s = segments[i]
    const t = clamp01((y - s.from) / Math.max(s.to - s.from, 1))
    return { i, s, t }
  }

  // A flight is not a straight line: dots arc toward the camera mid-move.
  function lift(i: number, a: number, b: number, e: number, out: { x: number; y: number; z: number }) {
    const k = Math.sin(Math.PI * e)
    out.x = 0
    out.y = 0
    out.z = 0
    if (a === QUIET && b === JOIN && ROWS[i].table === 'returns') {
      out.y = -60 * k
      out.z = -160 * k
    } else if (a === JOIN && b === BARS && (ROWS[i].table === 'order_lines' || ROWS[i].table === 'returns')) {
      out.y = -110 * k
      out.z = -340 * k
    } else if (a === BARS && b === LEAF) {
      const ang = seedC[i] * TAU
      const rad = Math.min(W, H) * 0.2 * k
      out.x = Math.cos(ang) * rad
      out.y = Math.sin(ang) * rad
      out.z = -220 * k
    }
  }

  const off = { x: 0, y: 0, z: 0 }
  let time = 0
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

  function camAt(a: Camera, b: Camera, t: number): Camera {
    return {
      x: lerp(a.x, b.x, t) + pointer.x * 26,
      y: lerp(a.y, b.y, t) + pointer.y * 18,
      z: lerp(a.z, b.z, t),
      tilt: lerp(a.tilt, b.tilt, t),
    }
  }

  // Project and bucket one pass of dots. `e` is null for a per-dot move.
  function pass(
    A: Layout,
    B: Layout,
    t: number,
    stagger: number,
    cam: Camera,
    weight: number,
    split: boolean,
    breath = 0,
    streak = 0,
  ) {
    const st = Math.sin(cam.tilt)
    const ct = Math.cos(cam.tilt)
    const cx = W / 2
    const cy = H / 2
    const a = layouts.indexOf(A)
    const b = layouts.indexOf(B)
    const driftA = !reduce && (a === CLOUD || a === DEEP) ? 1 : 0
    const driftB = !reduce && (b === CLOUD || b === DEEP) ? 1 : 0
    const breathing = !reduce && breath > 0
    const delays = stagger > 0 ? DELAYS.get(`${a}>${b}`) : undefined
    for (let i = 0; i < N; i++) {
      let e = t
      if (delays) e = clamp01((t - delays[i] * stagger) / (1 - stagger))
      e = ease(e)
      let x = lerp(A.x[i], B.x[i], e)
      let y = lerp(A.y[i], B.y[i], e)
      let z = lerp(A.z[i], B.z[i], e)
      if (A !== B) {
        lift(i, a, b, e, off)
        x += off.x
        y += off.y
        z += off.z
      }
      const drift = lerp(driftA, driftB, e)
      if (drift > 0) {
        const amp = 12 * (z / F) * drift
        x += Math.sin(time * 0.22 + seedA[i] * TAU) * amp
        y += Math.cos(time * 0.17 + seedB[i] * TAU) * amp * 0.7
      }
      if (breathing) {
        const s = 1 + 0.014 * breath * Math.sin(time * 1.1)
        x = geo.leaf.x + (x - geo.leaf.x) * s
        y = geo.leaf.y + (y - geo.leaf.y) * s
      }
      // Tilt the world about the plane at depth F, top edge away from us.
      const yy = y * ct + (z - F) * st
      const zz = F - y * st + (z - F) * ct
      const d = zz - cam.z
      if (d < 8) continue
      const s = F / d
      let alpha = lerp(A.a[i], B.a[i], e) * weight
      if (breathing) alpha *= 1 - breath * 0.14 * (0.5 + 0.5 * Math.sin(time * 1.7 + seedC[i] * TAU))
      // Fog: distant rows are dim and brighten as the camera approaches.
      alpha *= Math.min(1, Math.max(0.22, 1.2 - d / (6 * F)))
      // Rows fade as they reach the lens instead of popping.
      if (d < F * 0.3) alpha *= d / (F * 0.3)
      let r = lerp(A.r[i], B.r[i], e) * s
      if (r > 14) r = 14
      if (alpha < 0.03) continue
      const sx = cx + (x - cam.x) * s
      const sy = cy + (yy - cam.y) * s
      if (sx < -30 || sx > W + 30 || sy < -30 || sy > H + 30) continue
      // Dots nearer than the headline go on the front canvas, in front of the type.
      const front = split && d < F * 0.9 ? 1 : 0
      if (front) alpha *= Math.max(0.25, 1 - r / 26)
      const color = e < 0.5 ? A.c[i] : B.c[i]
      const level = Math.min(7, Math.floor(alpha * 8))
      const k = (front * (2 + LEAF_SHADES) + color) * 8 + level
      px[i] = sx
      py[i] = sy
      pr[i] = r
      pw[i] = r * lerp(A.shape, B.shape, e)
      if (streak) {
        // Where this row was a moment ago, seen from a camera that far back.
        const s0 = F / Math.max(d + streak, 8)
        tx[i] = cx + (x - cam.x) * s0
        ty[i] = cy + (yy - cam.y) * s0
      }
      bucketItems[k][bucketCount[k]++] = i
    }
  }

  function flush() {
    // Additive light: where rows overlap they glow, the way lit data should.
    bctx.globalCompositeOperation = 'lighter'
    fctx.globalCompositeOperation = 'lighter'
    for (let k = 0; k < BUCKETS; k++) {
      const n = bucketCount[k]
      if (!n) continue
      const front = Math.floor(k / ((2 + LEAF_SHADES) * 8))
      const color = Math.floor(k / 8) % (2 + LEAF_SHADES)
      const ctx = front ? fctx : bctx
      ctx.globalAlpha = ((k % 8) + 1) / 8
      ctx.fillStyle = palette[color] ?? BASE_PALETTE[ACCENT]
      ctx.beginPath()
      const items = bucketItems[k]
      for (let j = 0; j < n; j++) {
        const i = items[j]
        const r = pr[i]
        const w = pw[i]
        if (w > r * 1.15 || r < 1.2) ctx.rect(px[i] - w, py[i] - r, w * 2, r * 2)
        else {
          ctx.moveTo(px[i] + r, py[i])
          ctx.arc(px[i], py[i], r, 0, TAU)
        }
      }
      ctx.fill()
      if (streaking) {
        ctx.globalAlpha *= 0.55
        ctx.strokeStyle = ctx.fillStyle
        ctx.lineWidth = front ? 1.6 : 1
        ctx.beginPath()
        for (let j = 0; j < n; j++) {
          const i = items[j]
          ctx.moveTo(tx[i], ty[i])
          ctx.lineTo(px[i], py[i])
        }
        ctx.stroke()
      }
    }
    bucketCount.fill(0)
    bctx.globalCompositeOperation = 'source-over'
    fctx.globalCompositeOperation = 'source-over'
  }

  function projectPoint(x: number, y: number, cam: Camera) {
    const st = Math.sin(cam.tilt)
    const ct = Math.cos(cam.tilt)
    const yy = y * ct
    const zz = F - y * st
    const s = F / (zz - cam.z)
    return { x: W / 2 + (x - cam.x) * s, y: H / 2 + (yy - cam.y) * s, s }
  }

  // Relationships, table names, and the chart's labels, faded by how close
  // the film is to the layout they belong to.
  function overlays(seg: { a: number; b: number }, t: number, cam: Camera) {
    const near = (layout: number) =>
      seg.a === seg.b ? (seg.a === layout ? 1 : 0) : seg.a === layout ? 1 - smooth(t / 0.2) : seg.b === layout ? smooth((t - 0.8) / 0.2) : 0
    const mapW = near(MAP)
    const quietW = near(QUIET)
    const joinW = near(JOIN)
    const barsW = near(BARS)
    const holdT = seg.a === seg.b ? t : 1

    if (mapW + quietW + joinW > 0.01) {
      const ctx = bctx
      ctx.lineWidth = geo.phone ? 1 : 1.5
      ctx.lineCap = 'round'
      FOREIGN_KEYS.forEach((fk, n) => {
        const onPath = PATH.includes(fk.table) && PATH.includes(fk.references)
        const drawn =
          seg.a === MAP && seg.b === MAP ? smooth((holdT - n * 0.035) / 0.3) : seg.b === MAP ? 0 : 1
        const alpha = mapW * 0.7 * drawn + quietW * 0.05 + joinW * (onPath ? 0.95 : 0.1)
        if (alpha < 0.01 || drawn <= 0) return
        const A = geo.blocks.get(fk.table)!
        const B = geo.blocks.get(fk.references)!
        const p = projectPoint(A.x, A.y, cam)
        const q = projectPoint(B.x, B.y, cam)
        ctx.globalAlpha = alpha
        ctx.strokeStyle = joinW > 0.5 && onPath ? 'rgb(120,230,170)' : BASE_PALETTE[ACCENT]
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(lerp(p.x, q.x, drawn), lerp(p.y, q.y, drawn))
        ctx.stroke()
      })
      ctx.font = `500 ${geo.phone ? 9 : 11}px ${mono}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      for (const table of TABLES) {
        const b = geo.blocks.get(table.name)!
        const p = projectPoint(b.x, b.y + b.h / 2 + (geo.phone ? 4 : 8), cam)
        const onPath = PATH.includes(table.name)
        ctx.globalAlpha = mapW * (LEGACY.has(table.name) ? 0.45 : 0.8) + quietW * 0.04 + joinW * (onPath ? 0.95 : 0.18)
        ctx.fillStyle = joinW > 0.5 && onPath ? BASE_PALETTE[ACCENT] : BASE_PALETTE[INK]
        ctx.fillText(table.name, p.x, p.y)
      }
    }

    if (barsW > 0.01) {
      const ctx = bctx
      const labelIn = seg.a === BARS && seg.b === BARS ? smooth(holdT / 0.25) : barsW
      const c = geo.chart
      ANSWER.forEach((cat, col) => {
        const cxw = c.x0 + col * (c.bar + c.gap) + c.bar / 2
        const base = projectPoint(cxw, c.base, cam)
        const top = projectPoint(cxw, c.base - Math.ceil(cat.lines / c.per) * c.step, cam)
        ctx.globalAlpha = labelIn * (col === 0 ? 1 : 0.75)
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillStyle = BASE_PALETTE[INK]
        ctx.font = `500 ${geo.phone ? 8.5 : 11}px ${mono}`
        ctx.fillText(cat.name, base.x, base.y + 10)
        ctx.globalAlpha = labelIn * 0.6
        ctx.fillText(`of ${cat.lines}`, base.x, base.y + (geo.phone ? 22 : 26))
        // Returned lines are the bright base of each stack; the count sits on top.
        ctx.globalAlpha = labelIn
        ctx.textBaseline = 'bottom'
        ctx.fillStyle = BASE_PALETTE[ACCENT]
        ctx.font = `500 ${geo.phone ? 16 : 26}px ${serif}`
        ctx.fillText(String(cat.returns), top.x, top.y - 8)
      })
    }
  }

  let raf = 0
  let yTarget = scrollY
  let ySmooth = scrollY
  let lastCamZ = 0
  let lastState = ''
  const lerpRate = reduce ? 1 : fine ? 0.12 : 0.2

  function frame(now: number) {
    raf = 0
    time = now / 1000
    ySmooth += (yTarget - ySmooth) * lerpRate
    if (Math.abs(yTarget - ySmooth) < 0.5) ySmooth = yTarget
    pointer.x += (pointer.tx - pointer.x) * 0.06
    pointer.y += (pointer.ty - pointer.y) * 0.06

    bctx.clearRect(0, 0, W, H)
    fctx.clearRect(0, 0, W, H)
    const { i, s, t } = locate(ySmooth)
    const A = layouts[s.a]
    const B = layouts[s.b]
    const hero = s.a === CLOUD || s.a === DEEP
    let cam: Camera
    if (reduce && s.a !== s.b) {
      // Without motion a move is a cross-dissolve: no dot changes position.
      streaking = false
      const k = smooth(t)
      pass(A, A, 0, 0, A.cam, 1 - k, false)
      pass(B, B, 0, 0, B.cam, k, false)
      cam = k < 0.5 ? A.cam : B.cam
    } else {
      cam = camAt(A.cam, B.cam, ease(t))
      const breath = s.a === LEAF && s.b === LEAF ? smooth(t / 0.15) : 0
      // Scroll speed through the cloud becomes the length of the light trails.
      const flying = s.a === CLOUD && s.b === DEEP
      const streak = flying ? Math.max(-F * 0.7, Math.min(F * 0.7, (cam.z - lastCamZ) * 9)) : 0
      streaking = Math.abs(streak) > 4
      pass(A, B, t, s.stagger, cam, 1, hero && !reduce, breath, streaking ? streak : 0)
      lastCamZ = cam.z
    }
    flush()
    overlays(s, t, cam)
    bctx.globalAlpha = 1

    const state = `${i}.${Math.round(t * 24)}`
    if (state !== lastState) {
      film.setAttribute('data-sc-verify-state', state)
      lastState = state
    }

    const ambient = !reduce && (s.a === CLOUD || s.a === DEEP || (s.a === LEAF && s.b === LEAF))
    const gliding = ySmooth !== yTarget || Math.abs(pointer.tx - pointer.x) > 0.002 || Math.abs(pointer.ty - pointer.y) > 0.002
    if (!document.hidden && (gliding || ambient)) raf = requestAnimationFrame(frame)
  }

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame)
  }
  const onScroll = () => {
    yTarget = scrollY
    kick()
  }
  let lastWidth = innerWidth
  const onResize = () => {
    // Phones resize on every URL-bar move; only a width change is a new layout.
    if (!fine && innerWidth === lastWidth) return
    lastWidth = innerWidth
    resize()
    yTarget = ySmooth = scrollY
    kick()
  }
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    pointer.tx = e.clientX / innerWidth - 0.5
    pointer.ty = e.clientY / innerHeight - 0.5
    kick()
  }

  resize()
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onResize, { passive: true })
  document.addEventListener('visibilitychange', kick)
  if (fine && !reduce) addEventListener('pointermove', onPointer, { passive: true })

  const img = new Image()
  img.onload = () => {
    leafImg = img
    resize()
    kick()
  }
  img.src = leafSrc
  kick()

  return () => {
    cancelAnimationFrame(raf)
    img.onload = null
    removeEventListener('scroll', onScroll)
    removeEventListener('resize', onResize)
    document.removeEventListener('visibilitychange', kick)
    removeEventListener('pointermove', onPointer)
  }
}
