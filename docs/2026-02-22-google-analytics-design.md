# Design: Google Analytics 4 Integration

## Context

Add GA4 tracking to the Baseil landing page to track visitors and user interactions. The site is a Next.js 16 single-page app with multiple sections (Hero, HowItWorks, Capabilities, Problem, Sandbox, Footer).

## Approach

Use `@next/third-parties/google` — the official Next.js GA integration package. Store the measurement ID in an environment variable (`NEXT_PUBLIC_GA_ID`).

## Architecture

- **`@next/third-parties/google`** — `<GoogleAnalytics />` component in `layout.tsx`
- **`src/lib/analytics.ts`** — thin utility with `trackEvent()` helper wrapping `gtag()`
- **`.env.local`** — stores `NEXT_PUBLIC_GA_ID=G-XXXXXXXXX`
- Custom events fired from existing landing components (no new components)

## Event Tracking Plan

| Event Name | Trigger | Parameters |
|---|---|---|
| `page_view` | Automatic via GA4 | — |
| `cta_click` | CTA button click | `button_label`, `section` |
| `section_view` | Section enters viewport | `section_name` |
| `sandbox_interact` | User interacts with sandbox | `action` (e.g. "query_submitted") |
| `outbound_click` | External link click | `url`, `link_text` |

## Files to Create/Modify

1. **Create `src/lib/analytics.ts`** — `trackEvent()` helper wrapping `gtag()`
2. **Modify `src/app/layout.tsx`** — add `<GoogleAnalytics />` component
3. **Create `.env.local`** — `NEXT_PUBLIC_GA_ID=G-XXXXXXXXX` (placeholder)
4. **Modify landing components** — add `trackEvent()` calls to:
   - CTA buttons (Hero, Footer, Navigation — wherever CTAs exist)
   - Section IntersectionObservers (already exist — just add tracking call when visible)
   - Sandbox interactions
   - External links

## Analytics Utility

```ts
// src/lib/analytics.ts
export function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params)
  }
}
```

Simple null-safe wrapper. No abstraction overhead.

## Configuration

- GA measurement ID via `NEXT_PUBLIC_GA_ID` environment variable
- Create a separate GA4 property for this site (not shared with other projects)
