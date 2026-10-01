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

Internal preview pages, excluded from the sitemap: `/problem` (animated data-mesh explainer), `/showcase` (the showcase demo on its own), `/robot` (mascot playground). `next-sitemap.config.js` also excludes `/auth*` and the `/docs` index; individual doc pages stay in the sitemap.

### Key Directories

- `src/components/landing/`: All landing page sections + Navigation, Footer, BaseilLogo, BaseilMascot, ComingSoonBadge
- `src/components/landing/showcase/`: 6-scene interactive demo (ShowcaseShell, Scene*.tsx, useShowcaseTimer hook)
- `src/components/blog/`: MarkdownRenderer with custom styled components, MermaidDiagram
- `src/components/docs/`: DocsSidebar
- `src/lib/install.ts`: The single source of truth for the install snippet (`INSTALL_COMMAND`) and the desktop DMG URL (`DESKTOP_VERSION`, `DESKTOP_DMG_URL`)
- `src/lib/docs.ts`: Docs reader (gray-matter + fs, sorts by frontmatter `order`)
- `src/lib/blog.ts`: Blog post reader (gray-matter + fs, sorts by date desc)
- `src/lib/analytics.ts`: `trackEvent` wrapper
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

## Conventions

- All colors use inline Tailwind arbitrary values (`bg-[#0A0F0D]`), not a tailwind config theme
- Responsive text uses `clamp()`: `text-[clamp(1.8rem,3.5vw,2.8rem)]`
- Animations defined as `@keyframes` in `globals.css`, applied via utility classes
- Robot mascot images in `public/robot/`, current mascot is `robot-front-left.png`
- PR target: `master`
