# VERIFY: schema-walk

Verified on 2026-10-03 against `http://localhost:3100/scroll` (dev) and the
production build served by `next start`. Harness: the skill's `shoot.mjs`,
6 samples per act. Contact sheets were tiled in headless Chrome because no full
ffmpeg build was available.

## Harness runs (final code)

| Run | Viewport | Result |
|---|---|---|
| Desktop | 1440 x 900 | No dead scroll; every cue clears 4.5:1 at its worst frame |
| Laptop | 1280 x 720 | Same; the resolved walk fits with nothing clipped |
| Phone | 390 x 844 | Same |
| Short phone | 360 x 640 | Same; walk measured from y=58 to y=602 between chrome at 52 and 608 |
| Reduced motion | 1440 x 900 | Same; page shortens to 10.1vh |
| Production build | 1440 x 900 | Same; served `noindex, nofollow` |

## Found by reading frames, with the harness green each time

- Map labels rendered near 9px: the legacy tables moved into empty slots, and the map grew by about 25%.
- "computed in 0.00 ms": browsers coarsen the timer, so it now reads "under 0.1 ms".
- Phone tab strip overflowed and cut "Serve": tighter tabs, and the leaf hides under 400px.
- The install command truncated on phones: it is now a read-only textarea that wraps.
- Reduced motion froze the serve rail for 2.6vh: on wide screens the doors become a grid, and the span drops to 1.2.
- Short phones clipped the discovery narration and the last SQL lines: a height-gated compact mode.
- The feel check read Serve as busy, not broad: the MCP result shows one row instead of two.

## Functional

- Switching to another question updates the walk path, lit tables, SQL, answer, status receipt, MCP door, and close.
- Copy writes the exact command from `src/lib/install.ts` to the clipboard.
- Tab order runs sidebar, question radio, command, Copy, Install, footer. Every stop is on screen at full opacity with a visible focus ring.
- No console errors in dev or production.

## Feel check

Not cold: the builder ran it. Intended against felt: recognition / recognition,
relief / satisfying, anticipation / quiet, trust and delight / "aha",
breadth / busy (fixed above), resolve / resolved. The peak carries the page's
largest change (accent path, then the answer wipe) and its largest span.

## Not verified

- Real phones: touch scrolling and iOS behaviour. Headless Chrome only.
- Safari and Firefox rendering. Chrome only.
- The failed request in every run is Google Analytics with the placeholder ID
  `G-XXXXXXXXX` from `.env.local`, which predates this page.
