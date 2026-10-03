// The Baseil leaf as points: the opaque pixels of /robot/robot-leaf.png,
// sampled down to roughly one point per row of the sample database, with the
// leaf's own greens quantised into a few shades so dots can be drawn in batches.
// Used by the scroll film's close and by the landing hero.

export const LEAF_SHADES = 5
const FALLBACK = 'rgb(82,183,136)'

export interface LeafPoints {
  x: Float32Array
  y: Float32Array
  shade: Uint8Array
  palette: string[]
}

/** Samples the leaf's opaque pixels into about `count` points, centred on 0,0. */
export function sampleLeaf(img: HTMLImageElement, height: number, count: number): LeafPoints {
  const h = Math.round(height)
  const w = Math.round((h * img.naturalWidth) / img.naturalHeight)
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0, w, h)
  const data = ctx.getImageData(0, 0, w, h).data
  let opaque = 0
  for (let i = 3; i < data.length; i += 4) if (data[i] > 140) opaque++
  const stride = Math.max(1, Math.floor(Math.sqrt(opaque / count)))
  const xs: number[] = []
  const ys: number[] = []
  const lum: number[] = []
  const rgb: number[][] = []
  for (let y = 0; y < h; y += stride) {
    for (let x = 0; x < w; x += stride) {
      const o = (y * w + x) * 4
      if (data[o + 3] <= 140) continue
      xs.push(x - w / 2)
      ys.push(y - h / 2)
      lum.push(0.3 * data[o] + 0.59 * data[o + 1] + 0.11 * data[o + 2])
      rgb.push([data[o], data[o + 1], data[o + 2]])
    }
  }
  // The leaf's own greens, quantised into a few shades so dots still batch.
  const lo = Math.min(...lum)
  const hi = Math.max(...lum)
  const shade = new Uint8Array(xs.length)
  const sums = Array.from({ length: LEAF_SHADES }, () => [0, 0, 0, 0])
  lum.forEach((l, i) => {
    const s = Math.min(LEAF_SHADES - 1, Math.floor(((l - lo) / Math.max(hi - lo, 1)) * LEAF_SHADES))
    shade[i] = s
    sums[s][0] += rgb[i][0]
    sums[s][1] += rgb[i][1]
    sums[s][2] += rgb[i][2]
    sums[s][3]++
  })
  const palette = sums.map(([r, g, b, n]) =>
    n ? `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})` : FALLBACK,
  )
  return { x: Float32Array.from(xs), y: Float32Array.from(ys), shade, palette }
}
