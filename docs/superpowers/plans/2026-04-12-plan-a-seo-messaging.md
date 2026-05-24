# Plan A — SEO & Messaging Expansion

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Baseil's positioning on the landing page to cover the "data harness" concept, MCP exposure, A2A, and no-code analysis — while keeping the existing tone and visuals. Update SEO metadata so the site ranks for the expanded keyword set.

**Architecture:** Additive changes to the Hero section, a new "What Baseil Does" feature grid inserted between HowItWorks and Capabilities, expanded meta tags and JSON-LD, and a small semantic HTML audit to ensure proper heading structure for SEO crawlers.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4. No new dependencies.

**Branch:** `website-revamp-2026-04` (already created).

**Verification approach:** No unit test framework is set up in this project. Verify each task via:
- `npx tsc --noEmit` (type check)
- `npm run lint` (ESLint)
- `npm run build` (production build)
- Manual browser check at `http://localhost:3001` after `npm run dev`

---

## File Structure

**Files Created:**
- `src/components/landing/ComingSoonBadge.tsx` — small reusable "Coming soon" pill component
- `src/components/landing/WhatBaseilDoes.tsx` — new feature grid section with 6 tiles

**Files Modified:**
- `src/components/landing/Hero.tsx` — add expanded subtitle line, update audience chips to include new capabilities
- `src/components/landing/Navigation.tsx` — add new section to scroll-spy list
- `src/app/page.tsx` — insert WhatBaseilDoes between HowItWorks and Capabilities
- `src/app/layout.tsx` — expand meta keywords, update description, extend JSON-LD featureList
- `src/components/landing/HowItWorks.tsx` — semantic HTML (h2/h3 tags)
- `src/components/landing/Capabilities.tsx` — semantic HTML (h2/h3 tags)
- `src/components/landing/Problem.tsx` — semantic HTML (h2/h3 tags)

---

## Task 1: Create ComingSoonBadge component

A reusable pill that sits inline next to a feature name or chip to indicate it's not yet live.

**Files:**
- Create: `src/components/landing/ComingSoonBadge.tsx`

- [ ] **Step 1: Write the component**

File: `src/components/landing/ComingSoonBadge.tsx`

```tsx
interface ComingSoonBadgeProps {
  label?: string
  className?: string
}

export function ComingSoonBadge({ label = 'Soon', className = '' }: ComingSoonBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.6rem] font-[var(--font-outfit)] uppercase tracking-[0.15em] bg-[#52B788]/[0.08] text-[#52B788]/70 border border-[#52B788]/20 ${className}`}
      aria-label="Coming soon"
    >
      {label}
    </span>
  )
}
```

- [ ] **Step 2: Verify type check passes**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/ComingSoonBadge.tsx
git commit -m "feat(landing): add ComingSoonBadge component"
```

---

## Task 2: Update Hero — add expanded subtitle and new chips

Add a second tagline-style line that introduces the "data harness" positioning, and expand the audience chips to include MCP Tools, A2A Agents (coming soon), and No-Code Analysis.

**Files:**
- Modify: `src/components/landing/Hero.tsx`

- [ ] **Step 1: Update the imports to include new icons and badge**

In `src/components/landing/Hero.tsx`, replace the lucide-react import line:

```tsx
import { User, Bot, ArrowRight } from 'lucide-react'
```

with:

```tsx
import { User, Bot, ArrowRight, Plug, Network, Sparkles } from 'lucide-react'
import { ComingSoonBadge } from './ComingSoonBadge'
```

- [ ] **Step 2: Add the positioning subtitle under the description paragraph**

In `src/components/landing/Hero.tsx`, find the description `<p>` block (around line 142-146) that starts with `Baseil is an` and ends with `get answers instantly.`. Directly after that closing `</p>`, add:

```tsx
{/* Positioning subtitle */}
<p className={`font-[var(--font-outfit)] text-[0.82rem] leading-relaxed text-[#8FAF8A]/80 max-w-[560px] mx-auto mb-5 italic transition-all duration-700 delay-[850ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
  The intelligent data harness that connects your databases, exposes them as <span className="text-[#6FCF97] not-italic">MCP tools</span>, and serves answers to humans and agents alike. No code required.
</p>
```

Note: using "No code required." as a separate sentence instead of an em dash to match the project's writing style preference.

- [ ] **Step 3: Replace the audience chips with the expanded set**

Find the chips block (around line 149-163) that maps over `[{ icon: User, label: 'Humans' }, { icon: Bot, label: 'Agents' }]`. Replace that entire `<div>` with:

```tsx
{/* Audience and capability chips */}
<div className={`flex items-center justify-center flex-wrap gap-2.5 mb-7 transition-all duration-700 delay-[950ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
  {[
    { icon: User, label: 'Humans', comingSoon: false },
    { icon: Bot, label: 'Agents', comingSoon: false },
    { icon: Plug, label: 'MCP Tools', comingSoon: false },
    { icon: Network, label: 'A2A Agents', comingSoon: true },
    { icon: Sparkles, label: 'No-Code Analysis', comingSoon: false },
  ].map((chip, i) => (
    <div
      key={chip.label}
      className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#52B788]/12 bg-[#52B788]/[0.04] hover:bg-[#52B788]/[0.08] hover:border-[#52B788]/20 transition-all duration-300 cursor-default"
      style={{ transitionDelay: `${i * 100}ms` }}
    >
      <chip.icon size={13} className="text-[#52B788]/50 group-hover:text-[#52B788]/80 transition-colors duration-300" />
      <span className="text-[0.72rem] font-[var(--font-outfit)] text-[#8FAF8A] group-hover:text-[#C8D8C4] transition-colors duration-300">{chip.label}</span>
      {chip.comingSoon && <ComingSoonBadge className="ml-1" />}
    </div>
  ))}
</div>
```

- [ ] **Step 4: Verify type check passes**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 5: Start dev server and visually verify**

Run: `npm run dev`
Open `http://localhost:3001` and verify:
- The new italic subtitle line appears below the existing description with "MCP tools" highlighted
- 5 chips appear in the audience row (previously 2): Humans, Agents, MCP Tools, A2A Agents (with Soon badge), No-Code Analysis
- Chips wrap on smaller screens
- No visual regressions in the rest of the Hero

Stop the dev server (Ctrl+C) once verified.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/Hero.tsx
git commit -m "feat(hero): add data-harness subtitle and expanded capability chips"
```

---

## Task 3: Create WhatBaseilDoes feature grid

A compact 6-tile feature section that densely embeds target SEO keywords in natural feature copy.

**Files:**
- Create: `src/components/landing/WhatBaseilDoes.tsx`

- [ ] **Step 1: Write the component**

File: `src/components/landing/WhatBaseilDoes.tsx`

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Plug, Brain, MessageSquare, Layers, Network, Wand2 } from 'lucide-react'
import { ComingSoonBadge } from './ComingSoonBadge'

interface Feature {
  icon: typeof Plug
  title: string
  description: string
  comingSoon?: boolean
}

const FEATURES: Feature[] = [
  {
    icon: Plug,
    title: 'Expose data as MCP tools',
    description: 'Point Baseil at a database and it generates Model Context Protocol tools automatically. No extra code, no tool definitions to maintain.',
  },
  {
    icon: Brain,
    title: 'Intelligent data retrieval',
    description: 'Schema-aware retrieval across every database you connect. Baseil picks the right tool, writes the right query, and returns structured results.',
  },
  {
    icon: MessageSquare,
    title: 'No-code data analysis',
    description: 'Ask in plain English. Get structured answers back. No SQL, no BI tool learning curve, no middleman.',
  },
  {
    icon: Layers,
    title: 'One layer for humans and agents',
    description: 'Connect once. Serve everyone. Same intelligent layer answers chat questions, powers API calls, and feeds data to AI agents.',
  },
  {
    icon: Network,
    title: 'Expose your agent via A2A',
    description: 'Make Baseil discoverable to other agents through the Agent-to-Agent protocol. Compose specialized data agents into a mesh.',
    comingSoon: true,
  },
  {
    icon: Wand2,
    title: 'Customizable skills',
    description: 'Build and tune skills that optimize how your data gets accessed by agents. Encode business logic, shape retrieval patterns, pin workflows.',
    comingSoon: true,
  },
]

export function WhatBaseilDoes() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="what-baseil-does"
      className="relative py-24 px-6"
    >
      {/* Subtle aurora */}
      <div
        className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #52B788 0%, transparent 70%)' }}
      />

      <div className="relative max-w-[1100px] mx-auto">
        {/* Section label */}
        <p className={`font-[var(--font-outfit)] text-[0.72rem] uppercase tracking-[0.25em] text-[#52B788] mb-3 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          // What Baseil Does
        </p>

        {/* Heading */}
        <h2 className={`font-[var(--font-newsreader)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-medium leading-[1.1] tracking-tight mb-4 max-w-[720px] transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          The data harness your AI stack has been missing.
        </h2>

        {/* Subheading */}
        <p className={`font-[var(--font-outfit)] text-[0.95rem] leading-relaxed text-[#8FAF8A] max-w-[640px] mb-12 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Baseil is the intelligent layer between your data and everything that wants to use it. Humans asking questions, AI agents pulling context, apps making API calls. One connection, every interface.
        </p>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`group relative p-6 rounded-xl border border-[#52B788]/10 bg-[#111916]/40 hover:bg-[#111916]/60 hover:border-[#52B788]/25 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${300 + i * 80}ms` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 p-2 rounded-lg bg-[#52B788]/10 text-[#52B788]">
                  <feature.icon size={18} />
                </div>
                <div className="flex-1 flex items-center gap-2 flex-wrap pt-1">
                  <h3 className="font-[var(--font-outfit)] text-[0.95rem] font-medium text-[#C8D8C4]">
                    {feature.title}
                  </h3>
                  {feature.comingSoon && <ComingSoonBadge />}
                </div>
              </div>
              <p className="font-[var(--font-outfit)] text-[0.85rem] leading-relaxed text-[#8FAF8A]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify type check passes**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Verify lint passes**

Run: `npm run lint`
Expected: No errors in new file.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/WhatBaseilDoes.tsx
git commit -m "feat(landing): add WhatBaseilDoes feature grid section"
```

---

## Task 4: Insert WhatBaseilDoes into landing page

Place the new section between HowItWorks and Capabilities.

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add the import**

In `src/app/page.tsx`, after the existing landing component imports, add:

```tsx
import { WhatBaseilDoes } from '@/components/landing/WhatBaseilDoes'
```

- [ ] **Step 2: Insert the section between HowItWorks and Capabilities**

Replace the JSX body so the sections in order become:

```tsx
<Navigation />
<Hero />
<HowItWorks />
<WhatBaseilDoes />
<Capabilities />
<Problem />
<Sandbox />
<Footer />
```

- [ ] **Step 3: Start dev server and visually verify**

Run: `npm run dev`
Open `http://localhost:3001` and verify:
- The new "What Baseil Does" section appears between How It Works and Capabilities
- Section has the `// What Baseil Does` label, a heading, subheading, and 6 tiles
- A2A and Customizable skills tiles show the Soon badge
- Tiles stagger in on scroll (IntersectionObserver)
- On mobile the grid collapses to 1 column, tablet to 2, desktop to 3

Stop the dev server once verified.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(landing): insert WhatBaseilDoes between HowItWorks and Capabilities"
```

---

## Task 5: Update Navigation scroll-spy to include new section

The Navigation component uses IntersectionObserver to highlight the active section. Add the new `what-baseil-does` section.

**Files:**
- Modify: `src/components/landing/Navigation.tsx`

- [ ] **Step 1: Add the new section to the SECTIONS array**

In `src/components/landing/Navigation.tsx`, find the `SECTIONS` constant near the top (around lines 9-14). Replace it with:

```tsx
const SECTIONS = [
  { label: 'Home', id: 'top' },
  { label: 'How it Works', id: 'how-it-works' },
  { label: 'What We Do', id: 'what-baseil-does' },
  { label: 'Capabilities', id: 'capabilities' },
  { label: 'Demo', id: 'sandbox' },
]
```

- [ ] **Step 2: Verify the HowItWorks section has id="how-it-works"**

Run: `grep -n 'id="how-it-works"' src/components/landing/HowItWorks.tsx`

If not present, open `src/components/landing/HowItWorks.tsx` and locate the outermost `<section>` element. Ensure it has `id="how-it-works"`. If missing, add it.

- [ ] **Step 3: Verify the Capabilities section has id="capabilities"**

Run: `grep -n 'id="capabilities"' src/components/landing/Capabilities.tsx`

If not present, open and add `id="capabilities"` to the outermost `<section>`.

- [ ] **Step 4: Verify sandbox section has id="sandbox"**

Run: `grep -n 'id="sandbox"' src/components/landing/Sandbox.tsx`

If not present, add `id="sandbox"` to the outermost `<section>`.

- [ ] **Step 5: Start dev server and verify nav scroll-spy**

Run: `npm run dev`
Open `http://localhost:3001` and verify:
- Scrolling highlights the correct nav link as each section comes into view
- Click "What We Do" in nav — it scrolls to the WhatBaseilDoes section
- All nav links work

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/Navigation.tsx
# Also add any HowItWorks/Capabilities/Sandbox changes if you added ids
git add -u src/components/landing/
git commit -m "feat(nav): add What We Do to scroll-spy sections"
```

---

## Task 6: Update root metadata — keywords, description, OG, Twitter

Expand `src/app/layout.tsx` metadata to include the new keyword targets and broader positioning.

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update the description**

In `src/app/layout.tsx`, locate the `description` field (line 24-25) in the `metadata` object. Replace its value with:

```tsx
'Baseil is the intelligent data harness. Connect your databases, expose them as MCP tools, and give agents (and humans) natural-language access with no code. One layer for every interface.',
```

- [ ] **Step 2: Expand the keywords array**

Replace the `keywords` array (around lines 26-41) with:

```tsx
keywords: [
  'data harness',
  'intelligent data retrieval',
  'intelligent data agent',
  'agentic backends',
  'agentic data IDE',
  'AI retrieval',
  'self learning backend agent',
  'expose data as MCP',
  'expose database as MCP',
  'no code data analysis',
  'A2A agent',
  'build AI agents',
  'data agent',
  'data retrieval',
  'AI agents for data',
  'data intelligence',
  'database to MCP',
  'MCP tools',
  'natural language database query',
  'cross database joins',
  'schema discovery',
  'unified data layer',
  'baseil',
  'baseil data agent',
  'database AI agent',
  'data retrieval AI',
],
```

- [ ] **Step 3: Update OG and Twitter descriptions to match the new description**

Find the `openGraph` block (around lines 47-54) and the `twitter` block (around lines 55-60). Update both `description` fields to the same string you used in Step 1:

```tsx
description: 'Baseil is the intelligent data harness. Connect your databases, expose them as MCP tools, and give agents (and humans) natural-language access with no code. One layer for every interface.',
```

- [ ] **Step 4: Update JSON-LD featureList**

Find the JSON-LD script inside `<head>` (around lines 78-106). Locate the `featureList` array (around lines 97-103). Replace it with:

```tsx
featureList: [
  'Natural language data retrieval',
  'Expose databases as MCP tools',
  'A2A-ready agent exposure',
  'Cross-database joins',
  'Schema auto-discovery',
  'Intelligent data retrieval across databases',
  'No-code data analysis',
  'Data intelligence layer for AI agents',
],
```

Also update the JSON-LD `description` field in the same block to match the new description:

```tsx
description:
  'Baseil is the intelligent data harness. Connect your databases, expose them as MCP tools, and give agents (and humans) natural-language access with no code. One layer for every interface.',
```

- [ ] **Step 5: Verify type check passes**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 6: Verify build succeeds**

Run: `npm run build`
Expected: Build completes without errors. Check the output for any metadata warnings.

- [ ] **Step 7: Verify metadata in dev**

Run: `npm run dev`
Open `http://localhost:3001`, open browser DevTools, and in the Elements panel inspect `<head>`:
- Meta description reflects the new copy
- Meta keywords includes `data harness`, `agentic backends`, `expose database as MCP`, `A2A agent`
- JSON-LD script contains the updated featureList

Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(seo): expand metadata for data-harness positioning and new keywords"
```

---

## Task 7: Semantic HTML audit — ensure h2/h3 structure on Capabilities

Improve SEO by ensuring the Capabilities section uses proper heading tags rather than styled `<div>` or `<p>`. (HowItWorks and Problem are handled inside Plan C since they're being restructured there anyway — doing two plans touching the same files is a merge-conflict magnet.)

**Files:**
- Modify (as needed): `src/components/landing/Capabilities.tsx`

- [ ] **Step 1: Audit Capabilities headings**

Run: `grep -n '<h1\|<h2\|<h3' src/components/landing/Capabilities.tsx`

- Section title → `<h2>` (preserve all classNames)
- Feature row titles → `<h3>` (preserve all classNames)

- [ ] **Step 2: Verify type check passes**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Verify no visual regressions**

Run: `npm run dev`
Open `http://localhost:3001` and scroll to Capabilities. Confirm:
- Section title visually looks identical to before
- Feature row titles look identical
- No font or size shifts caused by browser default h2/h3 styling
- If there are default browser styles showing, add Tailwind classes to normalize

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/Capabilities.tsx
git commit -m "refactor(capabilities): use h2/h3 tags for SEO-friendly heading hierarchy"
```

---

## Task 8: Full build verification

Final verification that everything builds and lints clean.

- [ ] **Step 1: Type check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: Build completes without errors.

- [ ] **Step 4: Final manual check**

Run: `npm run dev`
Open `http://localhost:3001` and do a full scroll-through:
- Hero renders with new subtitle and 5 chips (A2A has Soon badge)
- HowItWorks renders normally
- WhatBaseilDoes renders with 6 tiles (A2A + Skills have Soon badges)
- Capabilities, Problem, Sandbox, Footer all render normally
- Navigation scroll-spy highlights the right section as you scroll
- All CTA buttons still work

Stop the dev server.

---

## Self-Review

Spec coverage check against `docs/superpowers/specs/2026-04-12-website-revamp-design.md`:

- §1.1 Hero Section Updates → Task 2 ✓
- §1.2 New "What Baseil Does" Feature Grid → Tasks 3, 4 ✓
- §1.3 Meta, SEO, Structured Data → Task 6 ✓
- §1.4 Semantic HTML for SEO → Task 7 ✓
- §1.5 Coming Soon Treatment → Task 1 ✓

All sections covered. Navigation scroll-spy update (Task 5) is a necessary side-effect of adding the new section.
