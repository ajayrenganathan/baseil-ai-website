# DataDam Landing Page - Design Document

**Date:** 2026-02-07
**Status:** Initial implementation complete, iterating

## Brand Identity

- **Product Name:** DataDam (rebranded from DataBridge)
- **Tagline:** "one calm layer. all your data."
- **Positioning statement:** "the missing middle"
- **Technical descriptor:** "an agent-native data layer"
- **Supporting copy:** "agents that go get your data"

## Domain Architecture

- `datadam.ai` — Marketing landing page
- `platform.datadam.ai` — Core product (the existing app)

## Target Audience

- **Primary:** Business leaders / non-technical buyers — people who want to unlock their data without hiring a data team
- **Secondary:** Technical founders, CTOs, developers — people building AI-native products who need a data layer
- **Page strategy:** Hero speaks broadly (the vision), then the page offers depth for technical audiences further down

## Business Model

- **Open core** with limitations on free tier
- **Community (Free):** Self-host, core features, limited connections/queries, single instance
- **Pro / Enterprise:** Remove limits, swarm/mesh, API/MCP generation, advanced features, managed hosting or self-hosted with license

## Visual Direction

**Aesthetic:** Dark & cinematic (Linear, Vercel style)

- Near-black backgrounds (#060610) with slight blue undertone
- Luminous cyan/teal accents (#0ee6d4) — represents water/dam/calm
- Blue (#3b82f6) for data elements
- Warm off-white text (#e8e6e3)
- Grain texture overlays for depth
- Subtle particle animations for "data flow"
- Radial gradient glows behind key sections

**Typography:**
- Display/headlines: Instrument Serif (editorial, calm, premium)
- Body/UI: DM Sans (clean geometric, highly readable)

**Motion:**
- CSS particle canvas in hero (calm, downward-flowing data dots)
- Scroll-triggered section reveals (IntersectionObserver)
- Shimmer effect on hero tagline
- Animated before/after transition in problem section
- Hover micro-interactions on cards and buttons

## Page Structure

### 1. Navigation (fixed)
- DataDam logo + wordmark
- Nav links: Problem, Demo, How it works, Open Source
- GitHub star button + "Request Early Access" CTA
- Transparent → frosted glass on scroll

### 2. Hero
- Full viewport height
- Animated particle canvas background
- Eyebrow badge: "Open Source · Now in Early Access"
- Headline: "one calm layer. all your data." (with shimmer on second line)
- Supporting copy: "DataDam discovers, connects, and retrieves your data autonomously — for humans, agents, and apps."
- Two CTAs: "Request Early Access" (primary, glowing) + "Try Live Demo" (ghost, scrolls to sandbox)
- Trust indicators: Open Source · Self-host or Managed · Agent-native
- Scroll indicator arrow

### 3. The Problem
- Section: "The bottleneck is already here."
- Before state: Chaos visual — tangled lines from scattered DBs to a single overwhelmed agent
- After state: Clean architecture — DBs → DataDam → Humans/Agents/Apps with flowing data dots
- Auto-transitions from before to after on scroll (IntersectionObserver)

### 4. Video Showcase
- Section: "From connection to first query in under five minutes."
- Custom video player with product UI thumbnail
- Glowing play button with pulsing ring
- Shimmer overlay on thumbnail
- Caption: "Connect a database · Auto-discover schemas · Query in natural language · Get results"

### 5. Live Sandbox
- Section: "Try it yourself." + "Query a live sample database in plain English. No signup required."
- Embedded query console with connection indicator
- Pre-populated sample query suggestions
- Mock results table with Results/SQL tabs
- Duration and row count metadata
- Nudge CTA: "Want this on your own data?"
- **Note:** Currently uses mock data; will connect to real DataDam instance

### 6. How it Works
- Three concise steps: Connect → Discover → Serve
- "Serve" covers: Natural language, APIs, MCPs — for Humans, agents, apps
- Subtle note: "...and it keeps getting smarter."

### 7. Capabilities
- 2x3 grid of capability cards:
  - Agent-native, Swarm-ready, Self-healing, Rules not code, APIs & MCPs, Open source

### 8. Open Source + Pricing Teaser
- Two-column: Community (Free) vs Pro (Early Access)
- Not a full pricing page — just enough to signal the model
- GitHub CTA for Community, Request Access CTA for Pro

### 9. Footer / Final CTA
- Email capture for early access waitlist
- Links: Docs, GitHub, Twitter, Discord
- DataDam logo
- Tagline sign-off: "one calm layer. all your data."

## Implementation

**Route:** `/landing` in the existing Next.js app (accessible at `localhost:3000/landing`)
**AppShell bypass:** Added `/landing` to auth routes array so sidebar is hidden

### Files Created
```
frontend/src/app/landing/page.tsx
frontend/src/components/landing/
  Navigation.tsx
  Hero.tsx
  Problem.tsx
  VideoShowcase.tsx
  Sandbox.tsx
  HowItWorks.tsx
  Capabilities.tsx
  Pricing.tsx
  Footer.tsx
  DataDamLogo.tsx
```

### CSS Added
Landing-specific styles in `globals.css`:
- `.landing-grain` — noise texture overlay
- `.landing-cta-primary` / `.landing-cta-ghost` — button styles
- `.landing-text-shimmer` — animated gradient text
- `.landing-shimmer-slide` — video thumbnail effect
- `.landing-dam-glow` — DataDam center node glow
- Custom scrollbar for landing page

### Fonts Added
- `Instrument Serif` (display) via `next/font/google`
- `DM Sans` (body) via `next/font/google`
- Exposed as CSS variables: `--font-instrument-serif`, `--font-dm-sans`

## Next Steps

- [ ] Connect sandbox to a real DataDam instance with sample database
- [ ] Record cinematic product walkthrough video
- [ ] Design and finalize DataDam logo (current is placeholder SVG)
- [ ] Add responsive/mobile styles
- [ ] Set up email capture backend (waitlist)
- [ ] Deploy to datadam.ai domain
- [ ] Add meta tags, OG images, structured data for SEO
- [ ] Add analytics (Plausible, PostHog, etc.)
