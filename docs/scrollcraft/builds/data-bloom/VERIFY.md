# VERIFY: data-bloom

Verified on 2026-10-03 against `http://localhost:3100/scroll` (dev) and the
production build served by `next start`.

The harness's `settle()` waits only for engine video clips. The film glides
toward its scroll target, so its frames were captured with a page-local probe
that waits 900ms per position. The harness still ran for dead scroll and
contrast; the film publishes its painted state on `data-sc-verify-state`.

## Harness runs (final code)

| Run | Viewport | Result |
|---|---|---|
| Desktop | 1440 x 900 | No dead scroll; every cue clears 4.5:1 at its worst frame |
| Phone | 390 x 844 | Same |
| Reduced motion | 1440 x 900 | Same |
| Production build | 1440 x 900 | Same; served `noindex, nofollow` |

## Smoothness

Frame times measured during a full scroll of the page in Chrome on this Mac:

| Run | Frames | Median | 95th percentile | Over 33ms |
|---|---|---|---|---|
| Desktop, dev | 229 | 16.7ms | 16.8ms | 0 |
| Phone viewport, dev | 216 | 16.7ms | 16.7ms | 0 |
| Desktop, production | 227 | 16.7ms | 16.7ms | 0 |

## Found by reading frames, with the harness green each time

- After the dolly, the hero emptied: the cloud filled the view only from the
  starting camera. It is now a tunnel, so the fly-through stays full.
- The rows read as a starfield. They are now strips with additive glow, so a
  table is a stack of records.
- The map and chart were small and grey: closer camera, stronger tilt, and a
  chart about 2.5 times larger.
- The chart's unreturned rows outshone the answer: their opacity dropped to 0.17.
- On phones, the question slid off the left edge. The engine's phone rule
  resets `left: 50%` on centred copy; the page restores it.
- On phones, the close overflowed to 482px: the nowrap command widened two
  grid columns. Both use `minmax(0, 1fr)`.
- On short phones, the leaf overlapped the closing headline. Its size is now
  capped by width.
- In the ask scene, the map's names showed through behind the question. They
  now fade nearly out.

## Functional

- Copy puts the exact displayed command on the clipboard.
- Every keyboard stop lands on screen at full opacity.
- No console errors in dev or production.

## Not verified

- Real phones: touch scrolling, iOS canvas performance, Low Power Mode. The
  phone frame times come from desktop Chrome at a phone viewport, not a phone.
- Safari and Firefox.
- The feel check was not cold: the builder ran it.
