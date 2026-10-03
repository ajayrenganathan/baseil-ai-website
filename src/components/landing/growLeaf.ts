import { ROWS } from '@/lib/sample-db'
import { LEAF_SHADES, sampleLeaf } from '@/lib/leaf'

// The landing hero's leaf. Every row of the sample database rises from below
// and grows into the Baseil sprout, soil and stem first, then the leaves. Then
// it breathes. Pointing at the leaf opens a small bubble: the rows under it
// part, with a soft falloff so no rim piles up, around an answer, and each part
// of the leaf holds a different one. On a touch screen the bubble rests on the
// leaf once it has grown, and from then on moves only with the finger.
// The leaf's size and place come from a box in the page's layout, so CSS stays
// in charge of composition. Work pauses whenever the hero is off screen.

const N = ROWS.length
const TAU = Math.PI * 2
const GROW_MS = 2600
const GRID = 16 // px per cell of the leaf's occupancy map
const REGION_COLS = 3
const REGION_ROWS = 2
const MAX_LENS_STEP = 16 // px per frame

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const ease = (x: number) => 1 - Math.pow(1 - x, 3)

export interface LeafOptions {
  canvas: HTMLCanvasElement
  /** Where the leaf grows; its size and position come from CSS. */
  box: HTMLElement
  /** The answer that rides inside the clearing. Positioned here, filled by React. */
  lens: HTMLElement
  src: string
  reduce: boolean
  /** The part of the leaf under the bubble, 0..5, or null when it closes. */
  onRegion: (region: number | null) => void
  /** Called once, when the leaf has finished growing. */
  onGrown?: () => void
}

export function growLeaf({ canvas, box, lens, src, reduce, onRegion, onGrown }: LeafOptions): () => void {
  const ctx = canvas.getContext('2d')!
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches

  // Per-row state. Targets are relative to the leaf's centre.
  const seed = Float32Array.from({ length: N }, (_, i) => ((i * 2654435761) % 4294967296) / 4294967296)
  const tx = new Float32Array(N)
  const ty = new Float32Array(N)
  const shade = new Uint8Array(N)
  const sx = new Float32Array(N)
  const sy = new Float32Array(N)
  const delay = new Float32Array(N)
  const ox = new Float32Array(N)
  const oy = new Float32Array(N)
  const vx = new Float32Array(N)
  const vy = new Float32Array(N)
  const px = new Float32Array(N)
  const py = new Float32Array(N)
  const pw = new Float32Array(N)
  const BUCKETS = LEAF_SHADES * 8
  const items = Array.from({ length: BUCKETS }, () => new Int32Array(N))
  const counts = new Int32Array(BUCKETS)

  let W = 0
  let H = 0
  let cx = 0
  let cy = 0
  let boxLeft = 0
  let boxTop = 0
  let radius = 1.6
  let palette: string[] = []
  let img: HTMLImageElement | null = null
  let started = 0
  let grown = false
  let visible = true
  let raf = 0
  // Which grid cells the leaf covers, and the leaf's bounds, in canvas px.
  let gridCols = 0
  let occupied = new Uint8Array(0)
  const bounds = { left: 0, top: 0, right: 0, bottom: 0 }

  // The lens: where it is aiming, where it is drawn, and whether it is open.
  const aim = { x: 0, y: 0, open: false }
  const at = { x: 0, y: 0, open: false }
  // The share of the way to its aim the lens covers each frame.
  let glide = 0.25
  let region: number | null = null
  // The lens's size, cached so frames never force a layout to read it.
  let lensW = lens.offsetWidth
  let lensH = lens.offsetHeight

  function layout() {
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const c = canvas.getBoundingClientRect()
    const b = box.getBoundingClientRect()
    W = c.width
    H = c.height
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    boxLeft = b.left - c.left
    boxTop = b.top - c.top
    cx = boxLeft + b.width / 2
    cy = boxTop + b.height / 2
    if (!img) return
    const height = Math.min(b.height, (b.width * img.naturalHeight) / img.naturalWidth)
    const leaf = sampleLeaf(img, height, N)
    palette = leaf.palette
    radius = Math.max(1.1, height / 230)
    gridCols = Math.ceil(W / GRID) + 1
    occupied = new Uint8Array(gridCols * (Math.ceil(H / GRID) + 1))
    bounds.left = bounds.top = Infinity
    bounds.right = bounds.bottom = -Infinity
    for (let i = 0; i < N; i++) {
      const k = Math.floor(seed[i] * leaf.x.length)
      tx[i] = leaf.x[k] + (seed[(i * 7) % N] - 0.5) * 1.4
      ty[i] = leaf.y[k] + (seed[(i * 13) % N] - 0.5) * 1.4
      shade[i] = leaf.shade[k]
      // Rows start as a loose band below the leaf and rise into place,
      // lowest targets first, so the sprout grows upward.
      sx[i] = cx + (seed[(i * 3) % N] - 0.5) * W * 1.1
      sy[i] = H + 20 + seed[(i * 5) % N] * H * 0.5
      delay[i] = clamp01(0.5 - ty[i] / height) * 0.75 + seed[(i * 11) % N] * 0.25
      const hx = cx + tx[i]
      const hy = cy + ty[i]
      const g = Math.floor(hy / GRID) * gridCols + Math.floor(hx / GRID)
      if (g >= 0 && g < occupied.length) occupied[g] = 1
      bounds.left = Math.min(bounds.left, hx)
      bounds.right = Math.max(bounds.right, hx)
      bounds.top = Math.min(bounds.top, hy)
      bounds.bottom = Math.max(bounds.bottom, hy)
    }
  }

  /** Whether a point is on the leaf, with one cell of tolerance around its edge. */
  function onLeaf(x: number, y: number) {
    const gx = Math.floor(x / GRID)
    const gy = Math.floor(y / GRID)
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const g = (gy + dy) * gridCols + gx + dx
        if (gx + dx >= 0 && gx + dx < gridCols && g >= 0 && g < occupied.length && occupied[g]) return true
      }
    return false
  }

  function regionAt(x: number, y: number) {
    const col = Math.min(REGION_COLS - 1, Math.floor(((x - bounds.left) / (bounds.right - bounds.left)) * REGION_COLS))
    const row = Math.min(REGION_ROWS - 1, Math.floor(((y - bounds.top) / (bounds.bottom - bounds.top)) * REGION_ROWS))
    return Math.max(0, row) * REGION_COLS + Math.max(0, col)
  }

  function frame(now: number) {
    // raf keeps this frame's id until the frame ends, so a kick() from inside a
    // frame (rest() makes one) cannot start a second loop alongside this one.
    if (!img || !palette.length) {
      raf = 0
      return
    }
    if (!started) started = now
    const grow = reduce ? 1 : clamp01((now - started) / GROW_MS)
    if (grow >= 1 && !grown) {
      grown = true
      onGrown?.()
      if (!fine && !reduce && !touched) rest()
    }
    const time = now / 1000
    const breath = reduce ? 0 : clamp01((now - started - GROW_MS) / 800)
    const scale = 1 + 0.012 * breath * Math.sin(time * 1.1)

    // The lens glides after its aim; opening snaps it into place first.
    if (aim.open && !at.open) {
      at.x = aim.x
      at.y = aim.y
    }
    at.open = aim.open
    // Capped in speed, so a long catch-up (a finger landing far from the
    // resting lens) reads as a glide rather than a jump.
    const stepX = (aim.x - at.x) * glide
    const stepY = (aim.y - at.y) * glide
    const cap = Math.min(1, MAX_LENS_STEP / (Math.hypot(stepX, stepY) || 1))
    at.x += stepX * cap
    at.y += stepY * cap
    lens.style.transform = `translate3d(${(at.x - lensW / 2).toFixed(1)}px,${(at.y - lensH / 2).toFixed(1)}px,0)`
    if (lens.dataset.open !== String(at.open)) lens.dataset.open = String(at.open)
    const next = at.open ? regionAt(at.x, at.y) : null
    if (next !== region) {
      region = next
      onRegion(region)
    }
    // The bubble: rows are pushed out by a Gaussian falloff. Keeping the push
    // under about 1.6 times its spread means rows never fold over each other,
    // so the edge stays soft instead of piling into a bright rim; 1.18 keeps
    // the bubble small while staying well clear of that limit.
    // The falloff clears out to about 1.3 times the hole, so a hole a little
    // under the lens's half-diagonal still keeps every row off the text.
    const hole = at.open ? Math.hypot(lensW, lensH) * 0.46 : 0
    const spread = 2 * (hole * 0.85) ** 2

    let settling = false
    ctx.clearRect(0, 0, W, H)
    for (let i = 0; i < N; i++) {
      const e = ease(clamp01((grow - delay[i] * 0.55) / 0.45))
      const hx = cx + tx[i] * scale
      const hy = cy + ty[i] * scale
      if (grown && !reduce) {
        // Rows inside the lens ease out to its edge; everyone else eases home.
        let wantX = 0
        let wantY = 0
        if (hole) {
          const dx = hx - at.x
          const dy = hy - at.y
          const d2 = dx * dx + dy * dy
          if (d2 < 9 * hole * hole) {
            const d = Math.sqrt(d2)
            const push = hole * Math.exp(-d2 / spread)
            wantX = d > 0.5 ? (dx / d) * push : Math.cos(seed[i] * TAU) * push
            wantY = d > 0.5 ? (dy / d) * push : Math.sin(seed[i] * TAU) * push
          }
        }
        vx[i] = (vx[i] + (wantX - ox[i]) * 0.14) * 0.74
        vy[i] = (vy[i] + (wantY - oy[i]) * 0.14) * 0.74
        ox[i] += vx[i]
        oy[i] += vy[i]
        if (Math.abs(vx[i]) + Math.abs(vy[i]) > 0.02) settling = true
      }
      const x = sx[i] + (hx - sx[i]) * e + ox[i]
      const y = sy[i] + (hy - sy[i]) * e + oy[i]
      let alpha = 0.25 + 0.75 * e
      if (breath) alpha *= 1 - 0.14 * breath * (0.5 + 0.5 * Math.sin(time * 1.7 + seed[i] * TAU))
      const k = shade[i] * 8 + Math.min(7, Math.floor(alpha * 8))
      px[i] = x
      py[i] = y
      // In flight a row is a strip; it settles into a dot.
      pw[i] = radius * (1 + 2 * (1 - e))
      items[k][counts[k]++] = i
    }

    ctx.globalCompositeOperation = 'lighter'
    for (let k = 0; k < BUCKETS; k++) {
      const n = counts[k]
      if (!n) continue
      ctx.globalAlpha = ((k % 8) + 1) / 8
      ctx.fillStyle = palette[Math.floor(k / 8)]
      ctx.beginPath()
      const list = items[k]
      for (let j = 0; j < n; j++) {
        const i = list[j]
        const w = pw[i]
        if (w > radius * 1.15) ctx.rect(px[i] - w, py[i] - radius, w * 2, radius * 2)
        else {
          ctx.moveTo(px[i] + radius, py[i])
          ctx.arc(px[i], py[i], radius, 0, TAU)
        }
      }
      ctx.fill()
    }
    counts.fill(0)
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1

    const alive = !reduce && (grow < 1 || breath > 0 || settling || at.open)
    raf = alive && visible && !document.hidden ? requestAnimationFrame(frame) : 0
  }

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame)
  }

  // Fine pointer: the lens hangs just below the cursor, so the cursor never
  // sits on the answer, and opens only while the cursor is over the leaf.
  const cursor = { x: -1e4, y: -1e4 }
  function aimAtCursor() {
    if (!grown) return
    const c = canvas.getBoundingClientRect()
    const x = cursor.x - c.left
    const y = cursor.y - c.top
    aim.open = onLeaf(x, y)
    aim.x = x
    aim.y = y + 18 + lensH / 2
    glide = 0.25
    kick()
  }
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    cursor.x = e.clientX
    cursor.y = e.clientY
    aimAtCursor()
  }
  // Scrolling moves the leaf under a still cursor; leaving the window closes the lens.
  const onScroll = () => aimAtCursor()
  const onLeaveWindow = (e: MouseEvent) => {
    if (e.relatedTarget) return
    aim.open = false
    kick()
  }

  // Touch: the lens rises just above the finger, so the finger never covers the
  // answer, and glides after it. A touch that starts on the leaf opens it, and it
  // stays open after the finger lifts so the answer can be read; a touch
  // anywhere else closes it. Listeners are passive, so a swipe on the leaf still
  // scrolls the page, and the leaf, and the lens with it, move under the finger.
  let touched = false
  function aimAtTouch(t: Touch | undefined, start: boolean) {
    if (!t || !grown) return
    const c = canvas.getBoundingClientRect()
    const x = t.clientX - c.left
    const y = t.clientY - c.top
    if (start) aim.open = onLeaf(x, y)
    else if (!aim.open) aim.open = onLeaf(x, y)
    if (aim.open) {
      aim.x = Math.min(Math.max(x, lensW / 2 + 8), W - lensW / 2 - 8)
      aim.y = Math.max(y - 32 - lensH / 2, lensH / 2 + 4)
      glide = 0.3
    }
    kick()
  }
  const onTouchStart = (e: TouchEvent) => {
    touched = true
    aimAtTouch(e.touches[0], true)
  }
  const onTouchMove = (e: TouchEvent) => aimAtTouch(e.touches[0], false)

  // Until then, the lens rests in one place on the right leaf, so a phone shows
  // that the leaf holds answers. It never moves on its own.
  function rest() {
    // The row nearest that spot where the whole lens fits over the leaf.
    const goalX = bounds.left + (bounds.right - bounds.left) * 0.72
    const goalY = bounds.top + (bounds.bottom - bounds.top) * 0.3
    let pick = -1
    let best = Infinity
    for (let i = 0; i < N; i++) {
      const x = cx + tx[i]
      const y = cy + ty[i]
      const fits =
        x - lensW / 2 >= Math.max(bounds.left, 8) &&
        x + lensW / 2 <= Math.min(bounds.right, W - 8) &&
        y - lensH / 2 >= bounds.top &&
        y + lensH / 2 <= bounds.bottom
      const d = Math.hypot(x - goalX, y - goalY)
      if (fits && d < best) {
        best = d
        pick = i
      }
    }
    if (pick < 0) return
    aim.x = cx + tx[pick]
    aim.y = cy + ty[pick]
    aim.open = true
    kick()
  }

  const resizer = new ResizeObserver(() => {
    layout()
    kick()
  })
  resizer.observe(canvas)
  resizer.observe(box)
  const lensSizer = new ResizeObserver(() => {
    lensW = lens.offsetWidth
    lensH = lens.offsetHeight
  })
  lensSizer.observe(lens)
  // Breathing is ambient work: stop it whenever the hero is off screen.
  const watcher = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) kick()
  })
  watcher.observe(canvas)
  document.addEventListener('visibilitychange', kick)
  if (fine && !reduce) {
    addEventListener('pointermove', onPointer, { passive: true })
    addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('mouseout', onLeaveWindow)
  }
  if (!reduce) {
    addEventListener('touchstart', onTouchStart, { passive: true })
    addEventListener('touchmove', onTouchMove, { passive: true })
  }

  const image = new Image()
  image.onload = () => {
    img = image
    layout()
    kick()
  }
  image.src = src

  return () => {
    cancelAnimationFrame(raf)
    image.onload = null
    resizer.disconnect()
    lensSizer.disconnect()
    watcher.disconnect()
    document.removeEventListener('visibilitychange', kick)
    removeEventListener('pointermove', onPointer)
    removeEventListener('scroll', onScroll)
    document.removeEventListener('mouseout', onLeaveWindow)
    removeEventListener('touchstart', onTouchStart)
    removeEventListener('touchmove', onTouchMove)
  }
}
