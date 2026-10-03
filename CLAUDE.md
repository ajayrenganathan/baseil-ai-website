# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build (postbuild runs next-sitemap)
npm start          # Start production server
npm run check:copy # Copy guardrails (install snippet + forbidden claims)
npx tsc --noEmit   # Type-check without emitting
```

`npm run lint` is not wired up yet: the script still calls `next lint`, which Next 16 removed, and the repo has no ESLint config. Use `npx tsc --noEmit` and `npm run check:copy` instead.

## Architecture

**Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4** marketing site for Baseil AI.

### Routes

| Route | Description |
|---|---|
| `/` | Landing page (Hero, QuickStart, HowItWorks, WhatBaseilDoes, Capabilities, Problem, Sandbox, Footer) |
| `/docs` | Docs listing, reads markdown from `content/docs/`, grouped by `category` and ordered by frontmatter `order` |
| `/docs/[slug]` | Individual doc page (SSG via `generateStaticParams`) with `DocsSidebar` |
| `/blog` | Blog listing, reads markdown from `content/blog/` |
| `/blog/[slug]` | Individual blog post (SSG via `generateStaticParams`) |
| `/pricing` | Pricing page (Pro free during beta, Teams and Enterprise on the waitlist) |
| `/platform` | Platform page, "Coming Soon" with cloud mascot |
| `/contact` | Contact page with copy-to-clipboard support email |
| `/auth/cli` | Clerk sign-in handoff for the CLI (redirects a short-lived token to the local callback URL) |
| `/auth/desktop` | Clerk sign-in handoff for the desktop app |

Internal preview pages, excluded from the sitemap: `/problem` (animated data-mesh explainer), `/showcase` (the showcase demo on its own), `/robot` (mascot playground). `/scroll` is the deep dive the hero links to (a scroll-craft film, see below); it is also noindex and excluded from the sitemap. `next-sitemap.config.js` also excludes `/auth*` and the `/docs` index; individual doc pages stay in the sitemap.

### Key Directories

- `src/components/landing/`: All landing page sections + Navigation, Footer, BaseilLogo, BaseilMascot, ComingSoonBadge
- `src/components/landing/showcase/`: 6-scene interactive demo (ShowcaseShell, Scene*.tsx, useShowcaseTimer hook)
- `src/components/blog/`: MarkdownRenderer with custom styled components, MermaidDiagram
- `src/components/docs/`: DocsSidebar
- `src/lib/install.ts`: The single source of truth for the install snippet (`INSTALL_COMMAND`) and the desktop DMG URL (`DESKTOP_VERSION`, `DESKTOP_DMG_URL`)
- `src/lib/docs.ts`: Docs reader (gray-matter + fs, sorts by frontmatter `order`)
- `src/lib/blog.ts`: Blog post reader (gray-matter + fs, sorts by date desc)
- `src/lib/analytics.ts`: `trackEvent` wrapper. GA is wired in `layout.tsx`: a tiny inline `gtag` queue runs after hydration, so early events are kept, and the library loads with `lazyOnload`, off the path to first paint
- `src/lib/sample-db.ts`: The seeded sample store database behind the hero's leaf and the `/scroll` film; `src/lib/leaf.ts` samples the leaf image into points for both
- `content/docs/`: Markdown docs pages with YAML frontmatter
- `content/blog/`: Markdown blog posts with YAML frontmatter
- `scripts/check-copy.mjs`: Copy guardrails, run via `npm run check:copy`
- `src/app/globals.css`: All custom CSS (animations, design tokens, CTA classes, effects)
- `docs/`: Internal documents that the site does not serve (investor deck, plans, handoffs)

### Design System

- **Background**: `#0A0F0D`, **Surface**: `#111916`, **Accent**: `#52B788` (green)
- **Fonts**: Newsreader (serif, headlines via `--font-newsreader`) + Outfit (sans, body via `--font-outfit`)
- **CTA classes**: `.baseil-cta-primary` (solid green), `.baseil-cta-ghost` (transparent border)
- **Patterns**: IntersectionObserver scroll reveals, 3D tilt cards, aurora mesh backgrounds, staggered entrance delays
- **Section labels**: code-comment style `// Section Name`

### Navigation

`Navigation.tsx` renders two kinds of links. Page links (Docs, Blog, Pricing, Platform) are `next/link` routes highlighted with `usePathname()`. Section links (Home, Install, How it Works) smooth-scroll to `#quick-start` and `#how-it-works` when the current pathname is `/`, and fall back to hash links to the home page elsewhere. The primary Install button in the nav bar is a separate link to `/docs/quickstart` and fires a `cta_click` analytics event.

## Copy rules

- The install snippet lives in `src/lib/install.ts` and is imported by `QuickStart.tsx`. It is duplicated verbatim in the markdown files listed in `scripts/check-copy.mjs`. Change it in `src/lib/install.ts` first, then update those files.
- Run `npm run check:copy` after touching install or CLI copy. It also rejects forbidden claims and placeholder `#` links.
- The shipped CLI commands are `setup`, `start`, `stop`, `status`, `logs`, `config`, `login`, `admin`, `recover`, `version`, `upgrade`, `help`. The site never documents a command that is not in `baseil help`.
- Database labels: PostgreSQL is GA. MySQL, SQLite, and Elasticsearch are beta.
- No em dashes in copy. Use commas, colons, parentheses, or separate sentences.

## Docs and Blog

Docs live in `content/docs/`, blog posts in `content/blog/`. The filename becomes the URL slug and the page appears automatically, with no code changes needed.

Docs frontmatter:

```yaml
---
title: "Quickstart"
description: "A short summary shown on the listing page"
order: 1
category: "getting-started"
---
```

`order` sorts pages inside a category; `category` is one of `getting-started`, `guides`, `reference`, `general`.

Blog frontmatter:

```yaml
---
title: "Your Post Title"
description: "A short summary shown on the listing page"
date: "2026-02-15"
author: "Author Name"
tags: ["tag1", "tag2"]
published: false # optional, omit or set true to publish
---
```

`published: false` keeps a draft out of the listing, the sitemap, and static generation.

Both render through `src/components/blog/MarkdownRenderer.tsx` and support headings, code blocks, tables (GFM), lists, blockquotes, images, links, and mermaid diagrams.

## /scroll (scroll-craft experiment)

- Built with the scroll-craft skill (github.com/nateherkai/scroll-craft). Briefs, the fingerprint registry, and verification notes live in `docs/scrollcraft/`, which `.scrollcraft.json` points the skill's scripts at. The current build is `data-bloom`; `schema-walk` was rejected and its code removed.
- `src/app/scroll/engine/` is the skill's engine, copied verbatim. Never edit it: theme it through the `--sc-*` tokens in `bloom.css`.
- `film.ts` draws the particle film on a fixed canvas, one dot per row in `src/lib/sample-db.ts`. Scroll writes a target and the film glides toward it, so frames taken right after a scroll are mid-glide; wait about a second before judging a screenshot.
- The engine calls `matchMedia` at import time, so it is loaded with a dynamic `import()` inside `useEffect`. Its stylesheet themes `html` and `body` globally, so links off the page are plain `<a>` (a full page load) to keep those styles off other routes.
- The engine's phone rule sets `inset-inline` on every `.sc-copy`, which breaks `.sc-copy--center`; restore `left: 50%` in page CSS.
- The landing hero (`src/components/landing/Hero.tsx`) grew out of this film's close: `growLeaf.ts` grows the same rows into the leaf on a canvas. The hover bubble shows `INSIGHTS` from `sample-db.ts`: every figure is computed from the seeded rows, never typed in. The headline ties to the leaf through color, not texture: `.leaf-type` fills it with the leaf's light-to-olive gradient and `.leaf-dot` makes its period one breathing leaf dot (a halftone fill was tried and read as busy).

## Conventions

- All colors use inline Tailwind arbitrary values (`bg-[#0A0F0D]`), not a tailwind config theme
- Font families need the type hint in Tailwind 4: `font-[family-name:var(--font-newsreader)]`. The bare `font-[var(--font-newsreader)]` form used across the existing components sets no family, so those headings render in the system sans.
- Responsive text uses `clamp()`: `text-[clamp(1.8rem,3.5vw,2.8rem)]`
- Animations defined as `@keyframes` in `globals.css`, applied via utility classes
- Robot mascot images in `public/robot/`, current mascot is `robot-front-left.png`
- The leaf logo comes in three files: `robot-leaf.webp` (16 KB) for anything that loads it raw (the hero and `/scroll` canvases, the SVG `<image>` in `Problem.tsx`), `robot-leaf-icon.png` for the favicon, and `robot-leaf.png` for metadata, the apple icon, and `next/image`, which optimizes it anyway

## Performance

- If a CSS change does not show up in `next dev`, stop it and delete `.next/dev`: Turbopack's persistent dev cache has served stale CSS here after production builds ran alongside it.
- Measure with Lighthouse against `npm run build && npx next start`, never the dev server, and take the median of five runs: single mobile runs of the same build swing from 72 to 94.
- Desktop scores 100. Mobile lands around 94, with LCP about 3.1s in Lighthouse's simulated slow 4G, mostly framework JS and the two fonts; plain `/contact` sits at 2.8s, so the leaf hero adds little. `experimental.inlineCss` was tried and made it worse: the CSS lands in the HTML twice, once in a style tag and once in the RSC payload.
- PR target: `master`
