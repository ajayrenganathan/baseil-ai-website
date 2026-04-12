# Plan C — Visual Elevation of How It Works and Problem sections

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the visual execution of the *How It Works* and *Problem* landing page sections so they match the immersive quality of *Hero* and *Sandbox*. The messaging and layout stay the same; the execution levels up with animated SVG icons, smoother particle trails, micro-animations inside cards, scroll-linked progress rings, animated slide morphing, and parallax depth.

**Architecture:** Keep existing component structure. Add a new `src/components/landing/icons/` directory with three animated SVG React components (ConnectIcon, DiscoverIcon, ServeIcon). Upgrade the particle trail between HowItWorks steps to use SVG paths and CSS animations. Add inline micro-animations via small child components per step. For Problem, replace the crossfade between slides with CSS-animated SVG morphs. Respect `prefers-reduced-motion` everywhere.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, CSS animations (Framer Motion not required; revisit if complexity grows).

**Branch:** `website-revamp-2026-04` (already created).

**Verification approach:** `npx tsc --noEmit`, `npm run lint`, `npm run build`, manual browser check. Visual/animation work is inherently best-verified by eye; each task includes a manual verification step.

---

## File Structure

**Files Created:**
- `src/components/landing/icons/ConnectIcon.tsx` — animated plug/database SVG
- `src/components/landing/icons/DiscoverIcon.tsx` — animated schema-mapping brain SVG
- `src/components/landing/icons/ServeIcon.tsx` — animated lightning-to-3-paths SVG
- `src/components/landing/icons/useReducedMotion.ts` — small hook to read the media query

**Files Modified:**
- `src/components/landing/HowItWorks.tsx` — replace emoji icons, upgrade particle trails, add micro-animations, add progress rings
- `src/components/landing/Problem.tsx` — add animated draw-in effects, morphing transitions, parallax depth
- `src/app/globals.css` — add any new keyframes used by the animations

---

## Task 0: Semantic HTML audit — HowItWorks and Problem

Before animation work, make sure these sections use proper h2/h3 tags. Doing this first keeps the animation tasks focused and avoids semantic changes conflicting with animation changes in the same diff.

**Files:**
- Modify (as needed): `src/components/landing/HowItWorks.tsx`
- Modify (as needed): `src/components/landing/Problem.tsx`

- [ ] **Step 1: Audit HowItWorks headings**

Run: `grep -n '<h1\|<h2\|<h3' src/components/landing/HowItWorks.tsx`

Identify the component's section title (the large heading below the `// How It Works` label) and the per-step titles.

- If the section title is currently a styled `<div>` or `<p>`, change it to `<h2>`. Preserve all classNames.
- If the per-step titles are currently styled `<div>` or `<p>`, change them to `<h3>`. Preserve all classNames.

- [ ] **Step 2: Audit Problem headings**

Run: `grep -n '<h1\|<h2\|<h3' src/components/landing/Problem.tsx`

- Section title → `<h2>`
- Per-slide titles (Problem, Solution, Swarm) → `<h3>`
- Preserve all classNames.

- [ ] **Step 3: Verify type check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Verify no visual regression**

Run: `npm run dev`. Scroll through How It Works and Problem. Confirm headings look identical to before. If browser default h2/h3 styles cause visual shifts, add Tailwind classes to normalize (e.g. `font-normal` if headings now appear bold).

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/HowItWorks.tsx src/components/landing/Problem.tsx
git commit -m "refactor(landing): use h2/h3 tags in HowItWorks and Problem"
```

---

## Task 1: Add useReducedMotion hook

Tiny helper used across animation components to respect the user's motion preference.

**Files:**
- Create: `src/components/landing/icons/useReducedMotion.ts`

- [ ] **Step 1: Write the hook**

File: `src/components/landing/icons/useReducedMotion.ts`

```ts
'use client'

import { useEffect, useState } from 'react'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}
```

- [ ] **Step 2: Verify type check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/icons/useReducedMotion.ts
git commit -m "feat(landing): add useReducedMotion hook"
```

---

## Task 2: Add keyframes to globals.css for new animations

Add reusable CSS keyframes that the new icon and section animations will use.

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append the new keyframes**

Append the following at the end of `src/app/globals.css`:

```css
/* ========== Plan C: Visual elevation animations ========== */

@keyframes draw-path {
  from { stroke-dashoffset: var(--total-length, 1000); }
  to { stroke-dashoffset: 0; }
}

@keyframes spark-pop {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1); }
}

@keyframes node-fade-in {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes breathing-glow {
  0%, 100% { filter: drop-shadow(0 0 4px rgba(82, 183, 136, 0.4)); }
  50% { filter: drop-shadow(0 0 12px rgba(82, 183, 136, 0.9)); }
}

@keyframes particle-flow {
  0% { offset-distance: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { offset-distance: 100%; opacity: 0; }
}

@keyframes tangle-wiggle {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-1px, 1px); }
  50% { transform: translate(1px, -1px); }
  75% { transform: translate(-1px, -1px); }
}

@keyframes progress-ring-fill {
  from { stroke-dashoffset: var(--ring-circumference, 188); }
  to { stroke-dashoffset: 0; }
}

@keyframes serve-split {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .baseil-anim-draw-path,
  .baseil-anim-spark-pop,
  .baseil-anim-node-fade-in,
  .baseil-anim-breathing-glow,
  .baseil-anim-particle-flow,
  .baseil-anim-tangle-wiggle,
  .baseil-anim-progress-ring-fill,
  .baseil-anim-serve-split {
    animation: none !important;
  }
}
```

- [ ] **Step 2: Verify build still passes**

Run: `npm run build`
Expected: Build completes. No CSS errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(styles): add animation keyframes for Plan C visuals"
```

---

## Task 3: Create ConnectIcon component

Animated SVG: a plug icon slides into a socket with a spark, then a line draws out to a database. Loops subtly.

**Files:**
- Create: `src/components/landing/icons/ConnectIcon.tsx`

- [ ] **Step 1: Write the component**

File: `src/components/landing/icons/ConnectIcon.tsx`

```tsx
'use client'

import { useReducedMotion } from './useReducedMotion'

export function ConnectIcon({ size = 48 }: { size?: number }) {
  const reduced = useReducedMotion()
  const animStyle = (delay: string, duration: string, name: string): React.CSSProperties =>
    reduced ? {} : { animation: `${name} ${duration} ease-in-out ${delay} infinite` }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="Connect">
      <title>Connect</title>
      {/* Plug */}
      <g
        className="baseil-anim-draw-path"
        style={animStyle('0s', '4s', 'node-fade-in')}
      >
        <rect x="4" y="24" width="16" height="16" rx="3" fill="#52B788" fillOpacity="0.2" stroke="#52B788" strokeWidth="1.5" />
        <line x1="8" y1="20" x2="8" y2="24" stroke="#52B788" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="20" x2="16" y2="24" stroke="#52B788" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* Spark */}
      <circle
        cx="22"
        cy="32"
        r="2"
        fill="#6FCF97"
        className="baseil-anim-spark-pop"
        style={animStyle('1.2s', '4s', 'spark-pop')}
      />
      {/* Connecting line */}
      <path
        d="M 20 32 L 44 32"
        stroke="#52B788"
        strokeWidth="1.5"
        strokeDasharray="24"
        className="baseil-anim-draw-path"
        style={{ ...animStyle('0.6s', '4s', 'draw-path'), ['--total-length' as string]: '24' }}
      />
      {/* Database icon */}
      <g
        className="baseil-anim-node-fade-in"
        style={animStyle('1.5s', '4s', 'node-fade-in')}
      >
        <ellipse cx="52" cy="24" rx="8" ry="3" fill="#52B788" fillOpacity="0.15" stroke="#52B788" strokeWidth="1.5" />
        <path d="M 44 24 L 44 40 C 44 42 48 43 52 43 C 56 43 60 42 60 40 L 60 24" stroke="#52B788" strokeWidth="1.5" fill="#52B788" fillOpacity="0.08" />
        <ellipse cx="52" cy="32" rx="8" ry="3" fill="none" stroke="#52B788" strokeWidth="1" strokeOpacity="0.4" />
      </g>
    </svg>
  )
}
```

- [ ] **Step 2: Verify type check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/icons/ConnectIcon.tsx
git commit -m "feat(landing): add animated ConnectIcon"
```

---

## Task 4: Create DiscoverIcon component

Animated SVG: schema nodes and relationships progressively render inside a brain outline.

**Files:**
- Create: `src/components/landing/icons/DiscoverIcon.tsx`

- [ ] **Step 1: Write the component**

File: `src/components/landing/icons/DiscoverIcon.tsx`

```tsx
'use client'

import { useReducedMotion } from './useReducedMotion'

export function DiscoverIcon({ size = 48 }: { size?: number }) {
  const reduced = useReducedMotion()
  const animStyle = (delay: string, duration: string, name: string): React.CSSProperties =>
    reduced ? {} : { animation: `${name} ${duration} ease-out ${delay} infinite` }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="Discover">
      <title>Discover</title>
      {/* Brain outline */}
      <path
        d="M 32 8 C 18 8 10 18 10 30 C 10 42 18 52 32 54 C 46 52 54 42 54 30 C 54 18 46 8 32 8 Z"
        stroke="#52B788"
        strokeWidth="1.5"
        strokeOpacity="0.5"
        fill="#52B788"
        fillOpacity="0.04"
      />
      {/* Schema nodes */}
      <circle cx="22" cy="24" r="3" fill="#52B788" className="baseil-anim-node-fade-in" style={animStyle('0.3s', '4s', 'node-fade-in')} />
      <circle cx="42" cy="24" r="3" fill="#52B788" className="baseil-anim-node-fade-in" style={animStyle('0.6s', '4s', 'node-fade-in')} />
      <circle cx="28" cy="36" r="3" fill="#52B788" className="baseil-anim-node-fade-in" style={animStyle('0.9s', '4s', 'node-fade-in')} />
      <circle cx="40" cy="40" r="3" fill="#52B788" className="baseil-anim-node-fade-in" style={animStyle('1.2s', '4s', 'node-fade-in')} />
      <circle cx="32" cy="48" r="3" fill="#6FCF97" className="baseil-anim-node-fade-in" style={animStyle('1.5s', '4s', 'node-fade-in')} />
      {/* Connecting edges */}
      <g stroke="#52B788" strokeWidth="1.2" strokeOpacity="0.7" fill="none">
        <line x1="22" y1="24" x2="42" y2="24" strokeDasharray="22" className="baseil-anim-draw-path" style={{ ...animStyle('0.4s', '4s', 'draw-path'), ['--total-length' as string]: '22' }} />
        <line x1="22" y1="24" x2="28" y2="36" strokeDasharray="14" className="baseil-anim-draw-path" style={{ ...animStyle('0.7s', '4s', 'draw-path'), ['--total-length' as string]: '14' }} />
        <line x1="42" y1="24" x2="40" y2="40" strokeDasharray="17" className="baseil-anim-draw-path" style={{ ...animStyle('1.0s', '4s', 'draw-path'), ['--total-length' as string]: '17' }} />
        <line x1="28" y1="36" x2="32" y2="48" strokeDasharray="13" className="baseil-anim-draw-path" style={{ ...animStyle('1.3s', '4s', 'draw-path'), ['--total-length' as string]: '13' }} />
        <line x1="40" y1="40" x2="32" y2="48" strokeDasharray="12" className="baseil-anim-draw-path" style={{ ...animStyle('1.5s', '4s', 'draw-path'), ['--total-length' as string]: '12' }} />
      </g>
    </svg>
  )
}
```

- [ ] **Step 2: Verify type check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/icons/DiscoverIcon.tsx
git commit -m "feat(landing): add animated DiscoverIcon"
```

---

## Task 5: Create ServeIcon component

Animated SVG: lightning bolt that splits into three paths leading to chat bubble, gear/agent, and code brackets.

**Files:**
- Create: `src/components/landing/icons/ServeIcon.tsx`

- [ ] **Step 1: Write the component**

File: `src/components/landing/icons/ServeIcon.tsx`

```tsx
'use client'

import { useReducedMotion } from './useReducedMotion'

export function ServeIcon({ size = 48 }: { size?: number }) {
  const reduced = useReducedMotion()
  const animStyle = (delay: string, duration: string, name: string): React.CSSProperties =>
    reduced ? {} : { animation: `${name} ${duration} ease-out ${delay} infinite` }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="Serve">
      <title>Serve</title>
      {/* Lightning bolt at center */}
      <path
        d="M 30 12 L 22 32 L 30 32 L 26 52 L 42 28 L 34 28 L 38 12 Z"
        fill="#52B788"
        stroke="#6FCF97"
        strokeWidth="1.2"
        className="baseil-anim-breathing-glow"
        style={animStyle('0s', '3s', 'breathing-glow')}
      />
      {/* Three output paths */}
      <g stroke="#52B788" strokeWidth="1.2" strokeOpacity="0.6" fill="none">
        <path d="M 38 20 Q 48 20 52 14" strokeDasharray="18" className="baseil-anim-draw-path" style={{ ...animStyle('0.4s', '3s', 'draw-path'), ['--total-length' as string]: '18' }} />
        <path d="M 42 32 L 54 32" strokeDasharray="12" className="baseil-anim-draw-path" style={{ ...animStyle('0.6s', '3s', 'draw-path'), ['--total-length' as string]: '12' }} />
        <path d="M 38 44 Q 48 44 52 50" strokeDasharray="18" className="baseil-anim-draw-path" style={{ ...animStyle('0.8s', '3s', 'draw-path'), ['--total-length' as string]: '18' }} />
      </g>
      {/* Chat bubble (humans) */}
      <g className="baseil-anim-serve-split" style={animStyle('0.9s', '3s', 'serve-split')}>
        <rect x="50" y="8" width="12" height="10" rx="2" fill="#52B788" fillOpacity="0.2" stroke="#52B788" strokeWidth="1" />
        <circle cx="54" cy="13" r="0.7" fill="#6FCF97" />
        <circle cx="56" cy="13" r="0.7" fill="#6FCF97" />
        <circle cx="58" cy="13" r="0.7" fill="#6FCF97" />
      </g>
      {/* Agent/gear */}
      <g className="baseil-anim-serve-split" style={animStyle('1.1s', '3s', 'serve-split')}>
        <circle cx="58" cy="32" r="4" fill="#52B788" fillOpacity="0.2" stroke="#52B788" strokeWidth="1" />
        <circle cx="58" cy="32" r="1.5" fill="#6FCF97" />
      </g>
      {/* Code brackets */}
      <g className="baseil-anim-serve-split" style={animStyle('1.3s', '3s', 'serve-split')} stroke="#52B788" strokeWidth="1" fill="none">
        <path d="M 54 46 L 52 50 L 54 54" strokeLinecap="round" />
        <path d="M 58 46 L 60 50 L 58 54" strokeLinecap="round" />
      </g>
    </svg>
  )
}
```

- [ ] **Step 2: Verify type check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/icons/ServeIcon.tsx
git commit -m "feat(landing): add animated ServeIcon"
```

---

## Task 6: Wire animated icons into HowItWorks

Replace the emoji icons in the HowItWorks step cards with the new animated SVG components.

**Files:**
- Modify: `src/components/landing/HowItWorks.tsx`

- [ ] **Step 1: Import the new icons**

At the top of `src/components/landing/HowItWorks.tsx`, after existing imports, add:

```tsx
import { ConnectIcon } from './icons/ConnectIcon'
import { DiscoverIcon } from './icons/DiscoverIcon'
import { ServeIcon } from './icons/ServeIcon'
```

- [ ] **Step 2: Find the steps array and replace emoji with icon components**

Open the file and look for an array of step definitions (should include the emojis 🔌, 🧠, ⚡ associated with each step's title and description). Modify each object so instead of an emoji string field, there's an `Icon` field pointing at the matching component:

For example if the current shape is:
```tsx
const STEPS = [
  { number: '01', title: 'Connect', emoji: '🔌', description: '...' },
  { number: '02', title: 'Discover', emoji: '🧠', description: '...' },
  { number: '03', title: 'Serve', emoji: '⚡', description: '...' },
]
```

Replace with:
```tsx
const STEPS = [
  { number: '01', title: 'Connect', Icon: ConnectIcon, description: '...' },
  { number: '02', title: 'Discover', Icon: DiscoverIcon, description: '...' },
  { number: '03', title: 'Serve', Icon: ServeIcon, description: '...' },
]
```

Then find where the emoji is rendered in JSX (likely inside the step card) and replace `{step.emoji}` with `<step.Icon size={48} />`.

- [ ] **Step 3: Verify type check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Start dev server and visually verify**

Run: `npm run dev`
Open `http://localhost:3001` and scroll to How It Works. Verify:
- Three step cards render
- Each card has an animated SVG icon instead of an emoji
- Icons animate (plug → spark → database; nodes fade in; lightning splits into 3 outputs)
- Animations loop subtly every 3-4s
- Cards still have the step counter, title, and description

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/HowItWorks.tsx
git commit -m "feat(landing): replace HowItWorks emoji icons with animated SVGs"
```

---

## Task 7: Upgrade particle trails between HowItWorks steps

Replace the current particle visualization with smoother particle streams using CSS motion paths.

**Files:**
- Modify: `src/components/landing/HowItWorks.tsx`

- [ ] **Step 1: Locate the connector area**

In `src/components/landing/HowItWorks.tsx`, search for where the current particle trail SVG is drawn between cards. It will contain circles or paths with some animation referencing the connectors.

- [ ] **Step 2: Replace the connector SVG with an upgraded version**

Replace the existing connector SVG block with the following (adapt positioning to match current layout):

```tsx
{/* Particle trail between steps — desktop only */}
<div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none" aria-hidden="true">
  <svg width="100%" height="6" viewBox="0 0 800 6" preserveAspectRatio="none">
    <defs>
      <linearGradient id="particle-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#52B788" stopOpacity="0" />
        <stop offset="50%" stopColor="#52B788" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#52B788" stopOpacity="0" />
      </linearGradient>
      <path id="connector-path" d="M 0 3 L 800 3" />
    </defs>
    <rect width="800" height="1" y="2.5" fill="url(#particle-gradient)" opacity="0.5" />
    {[0, 0.2, 0.4, 0.6, 0.8].map((delay, i) => (
      <circle key={i} r="1.8" fill="#6FCF97">
        <animateMotion dur="4s" repeatCount="indefinite" begin={`${delay * 4}s`}>
          <mpath href="#connector-path" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" begin={`${delay * 4}s`} />
      </circle>
    ))}
  </svg>
</div>
```

This uses SVG `<animateMotion>` rather than CSS motion paths for broader browser support. The particles flow left-to-right continuously with staggered delays.

- [ ] **Step 3: Verify visual**

Run: `npm run dev`. Scroll to How It Works. Verify:
- A thin gradient line sits between the step cards on desktop
- 5 small green particles continuously flow left-to-right along the line
- Particles fade in and out at the ends

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/HowItWorks.tsx
git commit -m "feat(landing): upgrade HowItWorks particle trails with animateMotion"
```

---

## Task 8: Add progress rings to HowItWorks step counters

A circular ring around each step number that fills as the user scrolls past the card.

**Files:**
- Modify: `src/components/landing/HowItWorks.tsx`

- [ ] **Step 1: Add state for scroll progress per card**

Inside the HowItWorks function component, add state and IntersectionObserver setup to track each step card's visibility ratio.

Near the top of the component body:

```tsx
const cardRefs = useRef<(HTMLDivElement | null)[]>([])
const [scrollProgress, setScrollProgress] = useState<number[]>([0, 0, 0])

useEffect(() => {
  const observers: IntersectionObserver[] = []
  cardRefs.current.forEach((card, i) => {
    if (!card) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrollProgress(prev => {
          const next = [...prev]
          next[i] = entry.intersectionRatio
          return next
        })
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    observer.observe(card)
    observers.push(observer)
  })
  return () => observers.forEach(o => o.disconnect())
}, [])
```

Ensure `useRef`, `useState`, `useEffect` are imported from React if not already.

- [ ] **Step 2: Attach refs to each step card**

Find where the step cards are rendered (probably a `.map` over `STEPS`). Attach a ref to each card:

```tsx
<div
  ref={el => { cardRefs.current[index] = el }}
  // ...existing props
>
```

Ensure the map callback exposes `index`.

- [ ] **Step 3: Add the progress ring SVG around the step number**

Find where the step number (e.g., `00`, `01`, `02`, `03`) is rendered. Wrap it in a positioned container that also contains an SVG circle ring:

```tsx
<div className="relative inline-flex items-center justify-center" style={{ width: 60, height: 60 }}>
  <svg width="60" height="60" viewBox="0 0 60 60" className="absolute inset-0" aria-hidden="true">
    <circle cx="30" cy="30" r="27" fill="none" stroke="rgba(82, 183, 136, 0.08)" strokeWidth="2" />
    <circle
      cx="30"
      cy="30"
      r="27"
      fill="none"
      stroke="#52B788"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="169.6"
      strokeDashoffset={169.6 * (1 - (scrollProgress[index] ?? 0))}
      transform="rotate(-90 30 30)"
      style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
    />
  </svg>
  <span className="relative font-[var(--font-outfit)] text-[1.4rem] font-medium text-[#52B788]">
    {step.number}
  </span>
</div>
```

(circumference of r=27 circle is 2π × 27 ≈ 169.6)

- [ ] **Step 4: Visual verify**

Run: `npm run dev`. Scroll slowly to How It Works. Verify:
- Each step card has a circle around its step number
- The circle fills clockwise as the card becomes more visible
- On a reduced-motion system, the ring still fills based on visibility (transition-none or removed transition is fine too)

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/HowItWorks.tsx
git commit -m "feat(landing): add scroll-linked progress rings to HowItWorks step counters"
```

---

## Task 9: Add micro-animations inside each HowItWorks card

Small looping animation inside each card that reinforces the step's meaning. Keep subtle.

**Files:**
- Modify: `src/components/landing/HowItWorks.tsx`

- [ ] **Step 1: Design — which micro-animation per card**

Connect card: a small terminal-style text animation typing `baseil connect postgres://…`. Implementation: a span showing a rotating caret and the text revealed via CSS keyframes.

Discover card: a mini schema tree that draws itself (similar to DiscoverIcon but smaller, inline, more data-table styled).

Serve card: small chat bubbles floating up and result bubbles floating down.

Given complexity, implement the **simplest visible version** of each and ship. Each can be a small inline component at the bottom of `HowItWorks.tsx` or a new file in `src/components/landing/icons/`.

- [ ] **Step 2: Implement inline MicroConnect, MicroDiscover, MicroServe components**

At the top of `src/components/landing/HowItWorks.tsx` (inside the file), add three small components before the `HowItWorks` export:

```tsx
function MicroConnect() {
  return (
    <div className="mt-4 p-2 rounded-md bg-[#0D1410] border border-[#52B788]/10 font-mono text-[0.68rem] text-[#8FAF8A] overflow-hidden">
      <span className="text-[#52B788]">$</span> baseil connect postgres://<span className="text-[#6FCF97]">app-db</span>
      <span className="inline-block w-2 h-3 ml-1 bg-[#52B788] align-middle animate-pulse" />
    </div>
  )
}

function MicroDiscover() {
  return (
    <div className="mt-4 flex items-center gap-1.5 text-[0.7rem] font-[var(--font-outfit)] text-[#8FAF8A]">
      <span className="inline-block w-2 h-2 rounded-sm bg-[#52B788]/60 animate-pulse" />
      <span>users</span>
      <span className="text-[#52B788]/40">→</span>
      <span className="inline-block w-2 h-2 rounded-sm bg-[#52B788]/60 animate-pulse" style={{ animationDelay: '0.3s' }} />
      <span>orders</span>
      <span className="text-[#52B788]/40">→</span>
      <span className="inline-block w-2 h-2 rounded-sm bg-[#52B788]/60 animate-pulse" style={{ animationDelay: '0.6s' }} />
      <span>products</span>
    </div>
  )
}

function MicroServe() {
  return (
    <div className="mt-4 flex items-center gap-2 text-[0.7rem] font-[var(--font-outfit)]">
      <span className="px-2 py-0.5 rounded-full bg-[#52B788]/10 border border-[#52B788]/20 text-[#6FCF97]">chat</span>
      <span className="px-2 py-0.5 rounded-full bg-[#52B788]/10 border border-[#52B788]/20 text-[#6FCF97]">mcp</span>
      <span className="px-2 py-0.5 rounded-full bg-[#52B788]/10 border border-[#52B788]/20 text-[#6FCF97]">api</span>
    </div>
  )
}
```

- [ ] **Step 3: Render the micro component inside each step card**

Modify the STEPS array to include a `Micro` component:

```tsx
const STEPS = [
  { number: '01', title: 'Connect', Icon: ConnectIcon, Micro: MicroConnect, description: '...' },
  { number: '02', title: 'Discover', Icon: DiscoverIcon, Micro: MicroDiscover, description: '...' },
  { number: '03', title: 'Serve', Icon: ServeIcon, Micro: MicroServe, description: '...' },
]
```

In the card JSX, after the description, render `<step.Micro />`.

- [ ] **Step 4: Visual verify**

Run: `npm run dev`. Scroll to How It Works. Verify:
- Each card now has a small decorative element below the description
- Connect: terminal-style prompt
- Discover: tiny node chain
- Serve: three protocol pills

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/HowItWorks.tsx
git commit -m "feat(landing): add micro-animations inside HowItWorks step cards"
```

---

## Task 10: Upgrade Problem — Slide 1 animated chaos

Animate the tangled data-source diagram so lines draw in progressively and icons pulse at irregular intervals.

**Files:**
- Modify: `src/components/landing/Problem.tsx`

- [ ] **Step 1: Locate Slide 1 SVG**

In `src/components/landing/Problem.tsx`, find the SVG for Slide 1 (the one with ~8 data source icons and tangled lines to a center bot).

- [ ] **Step 2: Add progressive draw animations to the tangled lines**

For each line/path in Slide 1, add classes and inline styles that animate stroke-dashoffset from full length to zero over ~2s, staggered.

Example pattern (apply to each line in the SVG):

```tsx
<path
  d="..."
  stroke="#C9672E"
  strokeOpacity="0.5"
  strokeWidth="1.2"
  fill="none"
  strokeDasharray="100"
  className="baseil-anim-draw-path"
  style={{
    ['--total-length' as string]: '100',
    animation: `draw-path 2s ease-out ${0.1 * lineIndex}s forwards`,
  }}
/>
```

Repeat for each of the ~8 lines with different delays (0s, 0.1s, 0.2s, ... 0.7s).

- [ ] **Step 3: Add irregular pulse to data source icons**

For each data source icon group in Slide 1, add:

```tsx
style={{
  animation: `baseil-pulse ${2 + Math.random() * 2}s ease-in-out infinite`,
  animationDelay: `${Math.random() * 2}s`,
}}
```

Note: `baseil-pulse` already exists in globals.css per the project exploration. If not, substitute `breathing-glow`.

Because `Math.random()` is non-deterministic per render, extract the values to a stable array defined once at module level to avoid hydration mismatch:

```tsx
const PULSE_VARIANTS = [
  { dur: '2.3s', delay: '0.1s' },
  { dur: '3.1s', delay: '0.8s' },
  { dur: '2.7s', delay: '1.4s' },
  { dur: '3.4s', delay: '0.3s' },
  { dur: '2.1s', delay: '1.1s' },
  { dur: '3.6s', delay: '0.6s' },
  { dur: '2.9s', delay: '1.7s' },
  { dur: '3.2s', delay: '0.2s' },
]
```

Use `PULSE_VARIANTS[index]` for each icon.

- [ ] **Step 4: Add subtle "overwhelmed" tangle-wiggle to the center bot**

Find the center bot element in Slide 1. Add:

```tsx
style={{ animation: 'tangle-wiggle 1.8s ease-in-out infinite' }}
className="baseil-anim-tangle-wiggle"
```

- [ ] **Step 5: Visual verify**

Run: `npm run dev`. Scroll to the Problem section. When Slide 1 is showing, verify:
- Lines between data sources and bot draw themselves in staggered
- Data source icons pulse at different rates (feels chaotic)
- Center bot has a slight wiggle

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/Problem.tsx
git commit -m "feat(landing): animate Slide 1 of Problem section with chaos effects"
```

---

## Task 11: Upgrade Problem — Slide 2 calm resolution

Animate the hub-and-spoke with flowing particles along clean paths.

**Files:**
- Modify: `src/components/landing/Problem.tsx`

- [ ] **Step 1: Locate Slide 2 SVG**

Find the SVG for Slide 2 (Baseil as hub, data sources around it).

- [ ] **Step 2: Replace radial paths with smooth curves and add particle flow**

Use `<animateMotion>` on small circles to make particles flow from data sources into the center Baseil node.

For each spoke from a data source to Baseil, add a `<path id="spoke-N">` with no stroke (invisible, used as motion path), and a `<circle>` that animates along it:

```tsx
<path id="spoke-1" d="M 40 40 L 100 100" fill="none" stroke="#52B788" strokeOpacity="0.3" strokeWidth="1" />
<circle r="2" fill="#6FCF97">
  <animateMotion dur="2.5s" repeatCount="indefinite" begin="0s">
    <mpath href="#spoke-1" />
  </animateMotion>
</circle>
```

Repeat for each spoke, with staggered delays (0s, 0.3s, 0.6s, etc.) so the flow feels organic.

- [ ] **Step 3: Add breathing glow to the center Baseil node**

Find the center node. Add:

```tsx
className="baseil-anim-breathing-glow"
style={{ animation: 'breathing-glow 3s ease-in-out infinite' }}
```

- [ ] **Step 4: Visual verify**

Run: `npm run dev`. Wait for Slide 2 or click the dot indicator to navigate there. Verify:
- Clean radial paths from data sources to Baseil
- Small particles flow from sources into Baseil
- Baseil node has a slow breathing glow

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/Problem.tsx
git commit -m "feat(landing): animate Slide 2 of Problem section with particle flow"
```

---

## Task 12: Upgrade Problem — Slide 3 swarm mesh

Animate the two-Baseil mesh with bidirectional flow between nodes.

**Files:**
- Modify: `src/components/landing/Problem.tsx`

- [ ] **Step 1: Locate Slide 3 SVG**

Find the SVG for Slide 3 (two Baseil nodes with mesh connection).

- [ ] **Step 2: Animate the bridge between the two Baseil nodes with bidirectional particles**

Add two invisible motion paths between the nodes (one forward, one reverse) and particles traveling on each:

```tsx
<path id="bridge-fwd" d="M 100 100 L 300 100" fill="none" />
<path id="bridge-rev" d="M 300 100 L 100 100" fill="none" />

<circle r="2" fill="#6FCF97">
  <animateMotion dur="3s" repeatCount="indefinite" begin="0s">
    <mpath href="#bridge-fwd" />
  </animateMotion>
</circle>
<circle r="2" fill="#6FCF97">
  <animateMotion dur="3s" repeatCount="indefinite" begin="1.5s">
    <mpath href="#bridge-rev" />
  </animateMotion>
</circle>
```

- [ ] **Step 3: Add breathing glow to both Baseil nodes, in sync**

Apply the same breathing-glow animation to both nodes. They should be visually synchronized (same duration and delay) to signal the mesh is stable.

- [ ] **Step 4: Animate entry of the second Baseil node**

When Slide 3 first renders, the second Baseil node should fade in with a slight scale animation. Wrap it in a group with:

```tsx
style={{ animation: 'node-fade-in 1s ease-out forwards' }}
```

- [ ] **Step 5: Visual verify**

Run: `npm run dev`. Navigate to Slide 3. Verify:
- Both Baseil nodes visible
- Second node fades in
- Bidirectional particle flow along the bridge
- Both nodes breathe in sync

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/Problem.tsx
git commit -m "feat(landing): animate Slide 3 of Problem section with mesh flow"
```

---

## Task 13: Upgrade Problem transitions and add parallax depth

Smoother transitions between slides and subtle parallax layers on tilt.

**Files:**
- Modify: `src/components/landing/Problem.tsx`

- [ ] **Step 1: Upgrade slide transition**

Find the slide change mechanism. The current crossfade likely uses `opacity` transitions between absolutely-positioned SVGs. Upgrade with:

- Outgoing slide: fade out + slight scale-down (`transform: scale(0.98)`)
- Incoming slide: fade in + scale to 1 from `scale(1.02)`

Add CSS transition `transition: opacity 0.7s ease, transform 0.7s ease` to each slide container.

Adjust the auto-rotate interval from 3.5s to ~5s to give the slower transitions time to play out without feeling rushed.

- [ ] **Step 2: Add parallax depth layers**

Inside the tilt card, add 2-3 absolutely-positioned background layers that move at different rates relative to the foreground.

Background layer (slow parallax): a subtle dot-grid or blur.
Mid layer: an aurora glow.
Foreground: the SVG diagram.

Use the existing tilt mechanism — whatever CSS variable or transform logic the tilt-card effect uses, scale the tilt intensity differently per layer. For example, if the foreground tilts at 1x, the mid layer at 0.5x, and the background at 0.2x.

If the current tilt implementation isn't straightforward to parameterize, add an inner `transform: translate3d(calc(var(--tilt-x) * 0.5), calc(var(--tilt-y) * 0.5), 0)` to the mid layer and `* 0.2` to the background.

Keep this subtle — a few pixels of offset at most.

- [ ] **Step 3: Visual verify**

Run: `npm run dev`. Watch the Problem section cycle through slides. Verify:
- Slide transitions are smoother and more morphing-feeling
- Moving the mouse over the card creates layered depth in the background
- Nothing feels janky or broken

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/Problem.tsx
git commit -m "feat(landing): upgrade Problem slide transitions and add parallax depth"
```

---

## Task 14: Reduced-motion audit

Verify that `prefers-reduced-motion: reduce` disables the heavy animations in the upgraded sections.

- [ ] **Step 1: Manual test with reduced-motion enabled**

Enable `prefers-reduced-motion: reduce` in the browser:
- Chrome DevTools → Rendering tab → Emulate CSS media feature prefers-reduced-motion: reduce
- Or system setting

Run: `npm run dev`
Navigate to How It Works and Problem sections. Verify:
- Icon animations are static (or very minimal)
- Particle flows stop or are much slower
- Slide transitions happen instantly (no morph)
- Tangle-wiggle stops
- Nothing feels jarring

If any animation still runs heavily, add the `baseil-anim-*` class to it so the reduced-motion CSS block (added in Task 2) catches it.

Stop the dev server.

- [ ] **Step 2: Disable reduced-motion, verify full animations still work**

Turn off the emulation. Verify animations play normally.

- [ ] **Step 3: Commit any fixes from Step 1**

```bash
git add -u
git commit -m "chore(a11y): verify reduced-motion disables heavy animations"
```

(Only commit if any changes were made.)

---

## Task 15: Full build verification

- [ ] **Step 1: Type check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: Build completes.

- [ ] **Step 4: Final manual walkthrough**

Run: `npm run dev`
- Scroll through the full landing page
- Verify How It Works has animated icons, progress rings, upgraded particles, and micro-animations inside cards
- Verify Problem cycles through slides with animated chaos, clean flow, and mesh mesh
- Verify slide transitions feel smoother
- Verify parallax depth on hover
- Verify nothing else on the page regressed

Stop the dev server.

---

## Self-Review

Spec coverage check against `docs/superpowers/specs/2026-04-12-website-revamp-design.md`:

- §2.1 How It Works — animated SVG icons → Tasks 3, 4, 5, 6 ✓
- §2.1 How It Works — particle trails → Task 7 ✓
- §2.1 How It Works — micro-animations → Task 9 ✓
- §2.1 How It Works — progress rings → Task 8 ✓
- §2.2 Problem — Slide 1 chaos → Task 10 ✓
- §2.2 Problem — Slide 2 resolution → Task 11 ✓
- §2.2 Problem — Slide 3 swarm → Task 12 ✓
- §2.2 Problem — transitions + parallax → Task 13 ✓
- §2.2 Problem — reduced motion → Task 14 (also Task 2 CSS block) ✓

All sections covered. Implementation-choice notes in the spec (framer-motion vs CSS) resolved in favor of CSS + SVG animateMotion for simplicity.
