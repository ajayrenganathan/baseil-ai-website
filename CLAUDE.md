# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (typically port 3001)
npm run build    # Production build
npm start        # Start production server
npm run lint     # ESLint via Next.js
npx tsc --noEmit # Type-check without emitting
```

## Architecture

**Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4** marketing site for Baseil AI.

### Routes

| Route | Description |
|---|---|
| `/` | Landing page (Hero, HowItWorks, Capabilities, Problem, VideoShowcase, Sandbox, Footer) |
| `/blog` | Blog listing — reads markdown from `content/blog/` |
| `/blog/[slug]` | Individual blog post (SSG via `generateStaticParams`) |
| `/pricing` | Pricing page (Basic free, Pro free during beta) |
| `/platform` | Platform page — "Coming Soon" with cloud mascot |

### Key Directories

- `src/components/landing/` — All landing page sections + Navigation, Footer, BaseilLogo, BaseilMascot
- `src/components/landing/showcase/` — 6-scene interactive demo (ShowcaseShell, Scene*.tsx, useShowcaseTimer hook)
- `src/components/blog/` — MarkdownRenderer with custom styled components
- `src/lib/blog.ts` — Blog post reader (gray-matter + fs, sorts by date desc)
- `content/blog/` — Markdown blog posts with YAML frontmatter
- `src/app/globals.css` — All custom CSS: animations, design tokens, CTA classes, effects

### Design System

- **Background**: `#0A0F0D`, **Surface**: `#111916`, **Accent**: `#52B788` (green)
- **Fonts**: Newsreader (serif, headlines via `--font-newsreader`) + Outfit (sans, body via `--font-outfit`)
- **CTA classes**: `.baseil-cta-primary` (solid green), `.baseil-cta-ghost` (transparent border)
- **Patterns**: IntersectionObserver scroll reveals, 3D tilt cards, aurora mesh backgrounds, staggered entrance delays
- **Section labels**: code-comment style `// Section Name`

### Navigation

`Navigation.tsx` uses scroll-spy (IntersectionObserver with `rootMargin: '-40% 0px -55% 0px'`) to highlight the active section. Separate route links for Pricing, Blog, Platform use `usePathname()`.

## Blog

Blog posts live in `content/blog/`. To add a new post:

1. Create a `.md` file in `content/blog/` (filename becomes the URL slug)
2. Add frontmatter at the top:

```yaml
---
title: "Your Post Title"
description: "A short summary shown on the listing page"
date: "2026-02-15"
author: "Author Name"
tags: ["tag1", "tag2"]
---
```

3. Write content in standard markdown below the frontmatter
4. Post appears automatically at `/blog/<filename>` — no code changes needed

Supports: headings, code blocks, tables (GFM), lists, blockquotes, images, links.

## Conventions

- All colors use inline Tailwind arbitrary values (`bg-[#0A0F0D]`), not a tailwind config theme
- Responsive text uses `clamp()`: `text-[clamp(1.8rem,3.5vw,2.8rem)]`
- Animations defined as `@keyframes` in `globals.css`, applied via utility classes
- Robot mascot images in `public/robot/` — current mascot is `robot-front-left.png`
- Branch: `Baseil-Concept` (main branch for PRs: `master`)
