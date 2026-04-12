# Baseil Website Revamp — Design Spec

**Date:** 2026-04-12
**Status:** Draft for review
**Owner:** Ajay

## Overview

This spec defines a revamp of the Baseil AI marketing website (`/Users/ajay/Desktop/projects/baseil-ai-website`) across three workstreams:

1. **SEO & messaging expansion** — broaden Baseil's positioning from "natural language database query tool" to "intelligent data harness" while preserving the current tone and visual identity.
2. **Visual elevation** — polish the *How It Works* and *Problem* sections so they match the immersive feel of the *Hero* and *Sandbox* sections.
3. **Content program** — ship a 13-piece content set (4 docs pages + 9 blog posts) targeting specific SEO keywords and developer-credibility topics.

The revamp is deliberately additive rather than a rewrite. The tagline, mascot, color palette, typography, animations, and section flow stay. What changes is what Baseil *claims* to be, how two specific sections *feel*, and what content exists alongside the landing page.

## Goals

- Rank for an expanded keyword set that reflects Baseil's broader product capabilities (data harness, MCP exposure, A2A, intelligent data agent, agentic backends, no-code analysis).
- Serve both technical (developers, data engineers) and non-technical (analysts, PMs, ops) audiences equally from the same landing page.
- Bring the *How It Works* and *Problem* sections up to the visual polish level of *Hero* and *Sandbox*.
- Launch a content program that drives SEO traffic and builds developer credibility in the MCP/A2A/agentic space.

## Non-Goals

- No changes to brand tone, tagline, mascot, or core visual identity.
- No messaging rewrite — we expand and layer, we don't replace.
- No new pages or routes beyond `/docs/*` (blog and docs infrastructure already exist).
- No changes to features that aren't live yet (flows, scheduled reports, agentic backends) beyond honest "coming soon" treatment.

## Feature Status (Source of Truth for Messaging)

The website can speak confidently about these as **live** capabilities:

- Natural language queries
- Auto schema discovery
- Expose data as MCP tools
- Cross-database joins (PostgreSQL, MySQL, SQLite, Elasticsearch)
- Rules system (synonyms, join hints, table priority, routing)
- Golden cache (semantic query caching)
- Multiple interfaces: Web UI, CLI, Desktop app, REST API, MCP

The website should mark these as **coming soon** with honest badging:

- A2A (Agent-to-Agent) — "very close"
- Build & customize skills
- Build flows for frequent analysis
- Build scheduled reports

The website can claim **no-code data analysis** as a current capability (chat + explore tab already provide this).

---

## Workstream 1: SEO & Messaging Expansion

### 1.1 Hero Section Updates

Modify `src/components/landing/Hero.tsx`:

- **Keep** the tagline "Get all your data talking"
- **Add** a secondary subtitle line below the current description that introduces the expanded positioning. Target copy:
  > "The intelligent data harness that connects your databases, exposes them as MCP tools, and serves answers to humans and agents alike — no code required."
- **Keep** the existing description paragraph (the "Baseil is an AI data agent..." text) — the subtitle sits alongside, it doesn't replace.
- **Update** the audience chips to include three new entries alongside the existing ones:
  - `MCP Tools` (live)
  - `A2A Agents` (coming soon — with subtle badge)
  - `No-Code Analysis` (live)

The chips should continue to use the same animation pattern already in the component.

### 1.2 New "What Baseil Does" Feature Grid

Add a new section to `src/app/page.tsx`, positioned **between** `HowItWorks` and `Capabilities`. Purpose: densely embed target keywords in natural feature copy.

**Component:** `src/components/landing/WhatBaseilDoes.tsx` (new)

**Content — six feature tiles:**

| Feature | Copy (working) | Status |
|---|---|---|
| Expose as MCP | "Expose your data as MCP tools — no extra code" | Live |
| Intelligent retrieval | "Intelligent data retrieval across every database" | Live |
| No-code analysis | "Ask in plain English. Get structured answers back." | Live |
| Unified layer | "Connect once. Serve humans, agents, and apps." | Live |
| A2A-ready | "Expose your agent to other agents via A2A" | Coming soon |
| Customizable skills | "Build and customize skills for optimized data access" | Coming soon |

**Styling:** follows existing feature-grid patterns (matches the look of `Capabilities.tsx` rows but more compact). Uses the site's existing `gradient-border-card` or `tilt-card` treatment. "Coming soon" items get a small pill/badge in accent green at low opacity — honest, not deflating.

### 1.3 Meta, SEO, and Structured Data Updates

Modify `src/app/layout.tsx`:

- **Expand meta keywords** to include: `data harness`, `agentic backends`, `intelligent data retrieval`, `AI retrieval`, `self learning backend agent`, `intelligent data agent`, `expose data as MCP`, `expose database as MCP`, `no code data analysis`, `agentic data IDE`, `A2A agent`, `build AI agents` — merged with existing keywords (don't lose current ones).
- **Update meta description** to reflect broader positioning. Target: "Baseil is the intelligent data harness. Connect your databases, expose them as MCP tools, give agents (and humans) natural-language access — all with zero code."
- **Update JSON-LD `SoftwareApplication` featureList** to add: "Expose databases as MCP tools", "A2A-ready agent exposure", "No-code data analysis", "Intelligent data retrieval across databases".

### 1.4 Semantic HTML for SEO

Audit landing page components (`Hero`, `HowItWorks`, `Problem`, `Capabilities`, new `WhatBaseilDoes`) for SEO-friendly heading structure:

- Ensure each section has a proper `<h2>` (section title) — some sections currently use styled `<div>` or `<p>` for headings.
- Ensure within-section titles use `<h3>`.
- Keep visual styling unchanged — this is a semantic/accessibility fix, not a visual change.

### 1.5 Coming Soon Treatment

Standardize a "Coming Soon" badge component (`src/components/landing/ComingSoonBadge.tsx` — new, small utility component). Used in the new feature grid and anywhere else we surface A2A, skills, flows, or scheduled reports. Small pill with accent green at ~40% opacity, short text like "Soon" or "Coming Soon".

---

## Workstream 2: Visual Elevation

### 2.1 How It Works — Upgraded Treatment

Modify `src/components/landing/HowItWorks.tsx`. Keep the 3-step layout, counter animation, bonus cards below, and tilt effects.

**Replace emoji icons with animated SVG illustrations:**

- **Step 1 (Connect)** — Plug icon animation: plug slides into a socket, a spark appears at the connection point, then a line draws out to a database icon. Loops subtly every few seconds.
- **Step 2 (Discover)** — Brain/scanner icon: table/column nodes progressively appear inside the brain outline, with connection lines drawing between them. Like watching a schema being mapped.
- **Step 3 (Serve)** — Lightning bolt that splits into 3 paths: one to a chat bubble (humans), one to a gear/bot (agents), one to a `{ }` code bracket (APIs/MCPs).

All SVGs live in `src/components/landing/icons/` (new directory) as React components for easy animation control. Use CSS animations or Framer Motion (already indirectly available — check if we should add it).

**Upgrade particle trails between cards:**

- Current: basic animated SVG circles between cards.
- New: smoother particle streams — small glowing dots that flow along a curved path between cards, with a trailing fade. Particles in accent green with varying opacity. Use CSS keyframes or Canvas for performance.

**Add micro-animations inside each card:**

- Connect card: a miniature terminal that types `baseil connect postgres://...` with a checkmark appearing at the end.
- Discover card: a mini schema tree that progressively renders — 3-4 table nodes with lines drawing between them.
- Serve card: small query-bubbles floating upward and result-bubbles floating downward, representing the flow of questions and answers.

Micro-animations should be subtle enough not to distract from the step's core message but visible enough to add depth.

**Progress rings on step counters:**

- Current counter: increments 00 → 01 → 02 → 03.
- Add: a circular progress ring around each step number that fills as the user scrolls past that card. Tracks scroll progress via IntersectionObserver thresholds (already used in the component).

### 2.2 Problem Section — Upgraded Treatment

Modify `src/components/landing/Problem.tsx`. Keep the 3-slide carousel, dot indicators, tilt card, and core diagram concepts.

**Slide 1 (The Problem) — animate the chaos:**

- Lines between data sources and the center bot draw themselves progressively, crossing and overlapping. The tangle builds up as the slide settles.
- Data source icons pulse at irregular intervals (out of sync with each other) to feel chaotic.
- The bot in the center has a subtle "overwhelmed" animation: slight shake, pulsing warning icon, maybe steam/smoke effect.

**Slide 2 (The Solution) — animate the resolution:**

- On enter: the tangled lines from Slide 1 *smooth out* into clean radial paths flowing into the Baseil node at center. This is a morphing transition from the previous slide's state, not a separate image.
- Data particles flow along the clean paths — small glowing dots traveling from source icons into Baseil, and result particles flowing back out.
- The Baseil node has a calm, rhythmic "breathing" pulse (glow grows and shrinks smoothly).

**Slide 3 (The Swarm) — animate the mesh:**

- Two Baseil nodes appear (the original from Slide 2, plus a second that fades in).
- A connection bridge draws between them with bidirectional particle flow.
- Each node has its own database cluster orbiting it.
- Particles occasionally cross the bridge between the two Baseil nodes, showing knowledge sharing.
- Stable, synchronized pulses — feels settled and powerful.

**Slide transitions:**

- Current: basic crossfade.
- New: morphing transitions where elements from one slide transform into elements of the next slide. Problem → Solution: tangled lines untangle. Solution → Swarm: the single Baseil node duplicates and a bridge forms.

**Depth / parallax layers:**

- Add 2-3 layered planes within each slide (background grid/dots, mid-layer glow, foreground diagram elements). On tilt, they move at different speeds to create a sense of depth. Extends the existing tilt effect rather than replacing it.

**Implementation notes:**

- The animations should use CSS transforms and keyframes where possible for performance.
- Consider extracting animation logic into hooks (`useTangleAnimation`, `useSlideMorph`) if complexity grows.
- Ensure the carousel still works on reduced-motion preference — animations simplified or disabled via `prefers-reduced-motion`.

---

## Workstream 3: Content Program

### 3.1 Content Inventory

**13 pieces total: 4 docs pages + 9 blog posts**

### 3.2 Docs Pages (4)

Docs live at `content/docs/` (new directory) as markdown files with frontmatter. Route: existing `/docs` page + new `/docs/[slug]` dynamic route.

| # | File | Title | Order | Audience |
|---|---|---|---|---|
| 1 | `quickstart.md` | Quickstart | 1 | Both |
| 2 | `connecting-databases.md` | Connecting Databases | 2 | Both |
| 3 | `chat-interface.md` | Chat Interface Guide | 3 | Non-technical |
| 4 | `mcp-setup.md` | MCP Setup Guide | 4 | Technical |

**Docs frontmatter convention:**

```yaml
---
title: "Quickstart"
description: "Install and run your first query in under 5 minutes"
order: 1
category: "getting-started"
---
```

**Docs content outlines:**

1. **Quickstart** — Prerequisites (Python 3.12+, Docker optional), run `baseil setup` wizard, walk through each setup question (DB, Clerk auth, LLM key, embedding model), `baseil start`, verify it's running, first query in the chat interface.
2. **Connecting Databases** — Add connections via UI and CLI. Cover each supported DB type with connection-string examples: PostgreSQL, MySQL, SQLite, Elasticsearch. Explain the onboarding pipeline in plain terms. How to monitor progress in the Activities panel.
3. **Chat Interface Guide** — For non-technical users. Asking questions, using `@connection.table` mentions, reading the transparency panel (SQL executed, duration, row count). Giving feedback (thumbs up/down), creating rules from feedback, pinning queries to the golden cache.
4. **MCP Setup Guide** — For technical users. Generate an API key, connect from Claude Desktop (show the `mcp.json` config), connect from Claude API. List of MCP tools (`baseil__query`, `baseil__describe`, `baseil__execute`, `baseil__setup`, `baseil__status`, `baseil__rules`, `baseil__ack`, `baseil__help`). Example agent workflows.

**Docs infrastructure:**

- Create `src/lib/docs.ts` (mirror of `src/lib/blog.ts`) to read markdown files from `content/docs/`.
- Replace the content of `src/app/docs/page.tsx` (currently a standalone placeholder page with no content listing) with a docs listing page that renders all docs pages ordered by `order` field.
- Create `src/app/docs/[slug]/page.tsx` for individual doc pages (similar pattern to `src/app/blog/[slug]/page.tsx`).
- Reuse `MarkdownRenderer` component from `src/components/blog/`.
- Add a simple sidebar navigation to docs pages (list of all docs in `order` sequence with active highlight). Can live in `src/components/docs/DocsSidebar.tsx`.

### 3.3 Blog Posts (9)

Blog posts live in `content/blog/` following the existing convention.

**SEO-driven posts (6):**

| # | File | Target Keyword | Title | Audience | Length |
|---|---|---|---|---|---|
| 1 | `data-harness-missing-from-ai-stack.md` | data harness | "The Data Harness Your AI Stack Is Missing" | Both | 800-1200 |
| 2 | `intelligent-data-retrieval.md` | intelligent data retrieval | "Intelligent Data Retrieval: What It Means When Your Data Layer Has Its Own AI" | Both | 800-1200 |
| 3 | `expose-database-as-mcp-no-code.md` | expose data as MCP | "Expose Your Database as MCP Tools — No Code Required" | Technical | 800-1200 |
| 4 | `ask-your-database-without-sql.md` | no code data analysis | "Ask Your Database Anything Without Writing SQL" | Non-technical | 800-1200 |
| 5 | `what-is-intelligent-data-agent.md` | intelligent data agent | "What Is an Intelligent Data Agent? (And Why You Need One)" | Both | 800-1200 |
| 6 | `database-to-agentic-backend-5-minutes.md` | agentic backends | "From Database to Agentic Backend in 5 Minutes" | Technical | 800-1200 |

**Developer credibility posts (3):**

| # | File | Topic | Title | Length |
|---|---|---|---|---|
| 7 | `inside-baseil-5-agent-pipeline.md` | Agent pipeline | "Inside Baseil's 5-Agent Pipeline: Discover, Build, Review, Test, Deploy" | 1500-2000 |
| 8 | `building-agentic-data-layer-mcp-a2a.md` | MCP + A2A ecosystem | "Building the Agentic Data Layer: MCP, A2A, and Why Your Data Needs Its Own Agent" | 1500-2000 |
| 9 | `agent-experience-ax-new-developer-experience.md` | Agent experience (AX) | "Why Agent Experience (AX) Is the New Developer Experience" | 1500-2000 |

**Post conventions:**

- Each post includes frontmatter with `title`, `description`, `date`, `author`, `tags`.
- Tags align with keyword clusters (e.g., `data-harness`, `mcp`, `a2a`, `agents`, `no-code`).
- Each post has a clear CTA at the end (try Baseil / join the waitlist / read the next related post).
- Internal links between thematically related posts.
- SEO posts focus on search-intent answers with practical examples.
- Credibility posts focus on opinionated takes with architecture depth.

### 3.4 Blog Visualizations (Mermaid + Custom)

Enhance `MarkdownRenderer` to support Mermaid diagrams.

**Requirements:**

- Install `mermaid` npm package.
- Create a custom code block handler in `MarkdownRenderer` that detects ` ```mermaid` blocks and renders them client-side via the Mermaid library.
- Configure Mermaid theme to match Baseil design: dark background, accent green (`#52B788`) for highlights, Outfit font for labels. Create shared theme config in `src/lib/mermaid-theme.ts`.
- Respect `prefers-reduced-motion` — Mermaid's animated rendering should be disabled for that preference.

**Posts that will include Mermaid diagrams:**

- **Post 7 (5-Agent Pipeline)** — sequence diagram of Discovery → ToolBuilder → Reviewer → Tester → Deploy with inputs and outputs at each stage.
- **Post 8 (MCP + A2A Ecosystem)** — architecture diagram showing Baseil as hub between humans, agents, data sources, with MCP and A2A protocols labeled.
- **Post 9 (Agent Experience)** — comparison flowchart of traditional API consumption (human-oriented) vs agent-optimized consumption.
- **Post 2 (Intelligent Data Retrieval)** — pipeline flow of query → tool selection → cache check → execution → response.
- **Post 1 (Data Harness)** — conceptual diagram: data sources → harness layer → consumers (humans, agents, systems).

**Custom inline visualizations (for posts where Mermaid isn't expressive enough):**

- Option 1: pre-built SVG images saved to `public/blog/` and referenced via standard markdown image syntax.
- Option 2: MDX-like support for embedding React components (decision deferred to implementation — Mermaid may be sufficient).
- Default to SVG images for now; revisit if a specific post needs richer interactivity.

---

## Architecture Impact

### Files Modified

- `src/components/landing/Hero.tsx` — subtitle, chip additions
- `src/components/landing/HowItWorks.tsx` — icons, particles, micro-animations, progress rings
- `src/components/landing/Problem.tsx` — animated slides, morphing transitions, parallax
- `src/components/blog/MarkdownRenderer.tsx` — Mermaid support
- `src/app/page.tsx` — insert new WhatBaseilDoes section
- `src/app/layout.tsx` — meta, keywords, structured data
- `src/app/docs/page.tsx` — docs listing
- `src/app/globals.css` — any new animation keyframes

### Files Added

- `src/components/landing/WhatBaseilDoes.tsx`
- `src/components/landing/ComingSoonBadge.tsx`
- `src/components/landing/icons/` — animated SVG icon components (ConnectIcon, DiscoverIcon, ServeIcon)
- `src/components/docs/DocsSidebar.tsx`
- `src/app/docs/[slug]/page.tsx`
- `src/lib/docs.ts`
- `src/lib/mermaid-theme.ts`
- `content/docs/` — 4 markdown files
- `content/blog/` — 9 new markdown files

### Dependencies

- `mermaid` (new) — for diagram rendering in blog posts.
- Possibly `framer-motion` — evaluate during implementation for animation ergonomics; current animations use CSS keyframes.

### Testing

- Visual regression check on landing page sections (manual browser check in dev).
- Type check (`npx tsc --noEmit`) passes.
- Lint (`npm run lint`) passes.
- Mermaid renders correctly in at least one blog post during implementation.
- Docs sidebar navigation works, active state correct.
- Reduced-motion preference disables heavy animations.

---

## Open Questions Deferred to Implementation

- Whether to adopt `framer-motion` for the new animations or stay with CSS keyframes. Decision during implementation based on complexity.
- Final copy for the Hero subtitle and WhatBaseilDoes tiles — current spec gives working copy, will be refined during implementation.
- Mermaid theme fine-tuning — colors and font rendering may need iteration once we see diagrams in context.

## Rollout

All three workstreams can ship as a single coordinated release or incrementally. Recommended order if incremental:

1. **Workstream 1** (messaging expansion) — lowest risk, biggest SEO lift, fastest to ship.
2. **Workstream 3** (content) — can start writing blog posts and docs in parallel with Workstream 1. Docs infrastructure (routes, sidebar) needs to ship first, then content can be added incrementally.
3. **Workstream 2** (visual elevation) — highest effort, ships last once the other workstreams are live.
