# Google Analytics 4 Integration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add GA4 tracking to the Baseil landing page — pageviews, CTA clicks, section visibility, sandbox interactions, and outbound link clicks.

**Architecture:** Use `@next/third-parties/google` for script injection in layout.tsx. A thin `src/lib/analytics.ts` utility wraps `gtag()` for custom events. Tracking calls are added to existing components at their interaction points (CTA onClick handlers, IntersectionObserver callbacks, sandbox actions). GA measurement ID stored in `.env.local`.

**Tech Stack:** Next.js 16, `@next/third-parties/google`, GA4 (gtag.js)

**Note:** No test framework exists in this project (no jest/vitest). Steps focus on implementation + type-checking (`npx tsc --noEmit`) for verification.

---

### Task 1: Install dependency and create environment config

**Files:**
- Modify: `/Users/ajay/Desktop/projects/baseil-ai-website/package.json`
- Create: `/Users/ajay/Desktop/projects/baseil-ai-website/.env.local`

**Step 1: Install @next/third-parties**

```bash
cd /Users/ajay/Desktop/projects/baseil-ai-website && npm install @next/third-parties
```

**Step 2: Create `.env.local` with placeholder measurement ID**

Create `/Users/ajay/Desktop/projects/baseil-ai-website/.env.local`:
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXX
```

**Step 3: Verify `.env.local` is in `.gitignore`**

Check that `.env*.local` is listed in `.gitignore`. If not, add it.

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install @next/third-parties for GA4 integration"
```

---

### Task 2: Create analytics utility and add GoogleAnalytics to layout

**Files:**
- Create: `/Users/ajay/Desktop/projects/baseil-ai-website/src/lib/analytics.ts`
- Modify: `/Users/ajay/Desktop/projects/baseil-ai-website/src/app/layout.tsx`

**Step 1: Create `src/lib/analytics.ts`**

```ts
// Extend Window to include gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

export function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params)
  }
}
```

**Step 2: Add `<GoogleAnalytics />` to `layout.tsx`**

Import `GoogleAnalytics` from `@next/third-parties/google` and add it inside `<html>` just before `<body>`:

```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

// Inside the return, after <head>...</head> and before <body>:
{process.env.NEXT_PUBLIC_GA_ID && (
  <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
)}
```

The conditional ensures it doesn't break if the env var is missing.

**Step 3: Verify types**

```bash
cd /Users/ajay/Desktop/projects/baseil-ai-website && npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add src/lib/analytics.ts src/app/layout.tsx
git commit -m "feat: add GA4 script and analytics utility"
```

---

### Task 3: Add section visibility tracking

All these components already have IntersectionObserver with `setVisible(true)`. Add a `trackEvent('section_view', ...)` call right next to the existing `setVisible(true)`.

**Files:**
- Modify: `/Users/ajay/Desktop/projects/baseil-ai-website/src/components/landing/HowItWorks.tsx` (~line 258)
- Modify: `/Users/ajay/Desktop/projects/baseil-ai-website/src/components/landing/Capabilities.tsx` (~line 46)
- Modify: `/Users/ajay/Desktop/projects/baseil-ai-website/src/components/landing/Problem.tsx` (~line 476)
- Modify: `/Users/ajay/Desktop/projects/baseil-ai-website/src/components/landing/Sandbox.tsx` (~line 162)
- Modify: `/Users/ajay/Desktop/projects/baseil-ai-website/src/components/landing/Footer.tsx` (~line 20)
- Modify: `/Users/ajay/Desktop/projects/baseil-ai-website/src/components/landing/Pricing.tsx` (~line 197)

**Step 1: Add tracking to each component's IntersectionObserver callback**

In each file, add this import at the top:
```ts
import { trackEvent } from '@/lib/analytics'
```

Then in each observer callback, right after `setVisible(true)`, add:
```ts
trackEvent('section_view', { section_name: 'SECTION_NAME' })
```

Where SECTION_NAME is:
- HowItWorks.tsx → `'how_it_works'`
- Capabilities.tsx → `'capabilities'`
- Problem.tsx → `'problem'`
- Sandbox.tsx → `'sandbox'`
- Footer.tsx → `'footer'`
- Pricing.tsx → `'pricing'`

**Step 2: Verify types**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/components/landing/HowItWorks.tsx src/components/landing/Capabilities.tsx src/components/landing/Problem.tsx src/components/landing/Sandbox.tsx src/components/landing/Footer.tsx src/components/landing/Pricing.tsx
git commit -m "feat: add section visibility tracking to all landing sections"
```

---

### Task 4: Add CTA click tracking

**Files:**
- Modify: `/Users/ajay/Desktop/projects/baseil-ai-website/src/components/landing/Navigation.tsx` (~line 174)
- Modify: `/Users/ajay/Desktop/projects/baseil-ai-website/src/components/landing/Hero.tsx` (~lines 166-180)
- Modify: `/Users/ajay/Desktop/projects/baseil-ai-website/src/components/landing/Sandbox.tsx` (~line 453)
- Modify: `/Users/ajay/Desktop/projects/baseil-ai-website/src/components/landing/Pricing.tsx` (~line 169-185)
- Modify: `/Users/ajay/Desktop/projects/baseil-ai-website/src/components/landing/Footer.tsx` (~line 108)

**Step 1: Add tracking import and onClick handlers**

For each CTA, add an `onClick` handler (or extend existing one) that calls:
```ts
trackEvent('cta_click', { button_label: 'LABEL', section: 'SECTION' })
```

Specific tracking calls:

| File | Button | Params |
|------|--------|--------|
| Navigation.tsx | "Join Waitlist" | `{ button_label: 'join_waitlist', section: 'navigation' }` |
| Hero.tsx | "Join the Waitlist" | `{ button_label: 'join_waitlist', section: 'hero' }` |
| Hero.tsx | "Try the Demo" | `{ button_label: 'try_demo', section: 'hero' }` |
| Sandbox.tsx | "Want this on your own data?" | `{ button_label: 'want_on_your_data', section: 'sandbox' }` |
| Pricing.tsx | "Join the Waitlist" (Pro) | `{ button_label: 'join_waitlist', section: 'pricing_pro' }` |
| Pricing.tsx | "Contact Us" (Enterprise) | `{ button_label: 'contact_us', section: 'pricing_enterprise' }` |
| Footer.tsx | "Join Waitlist" (form submit) | `{ button_label: 'join_waitlist', section: 'footer' }` |

Add `import { trackEvent } from '@/lib/analytics'` to files that don't already have it (Navigation.tsx, Hero.tsx, Pricing.tsx — Sandbox and Footer already added in Task 3).

**Step 2: Verify types**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/components/landing/Navigation.tsx src/components/landing/Hero.tsx src/components/landing/Sandbox.tsx src/components/landing/Pricing.tsx src/components/landing/Footer.tsx
git commit -m "feat: add CTA click tracking across landing components"
```

---

### Task 5: Add sandbox interaction tracking

**Files:**
- Modify: `/Users/ajay/Desktop/projects/baseil-ai-website/src/components/landing/Sandbox.tsx`

**Step 1: Add tracking calls to sandbox interactions**

The `trackEvent` import is already present from Tasks 3-4. Add calls at these points:

1. **AI mode toggle** (~line 270-281 onClick):
   ```ts
   trackEvent('sandbox_interact', { action: 'toggle_ai_mode' })
   ```

2. **Database tab switch** (~line 287-303 onClick):
   ```ts
   trackEvent('sandbox_interact', { action: 'switch_database', database: DB_NAME })
   ```
   Where DB_NAME comes from the database label (e.g. 'ecommerce', 'inventory', etc.)

3. **Query suggestion click** (~line 334-342 onClick):
   ```ts
   trackEvent('sandbox_interact', { action: 'select_query' })
   ```

4. **Query execution** (inside `runQuery()` function ~line 196):
   ```ts
   trackEvent('sandbox_interact', { action: 'run_query' })
   ```

**Step 2: Verify types**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/components/landing/Sandbox.tsx
git commit -m "feat: add sandbox interaction tracking"
```

---

### Task 6: Add outbound link tracking

**Files:**
- Modify: `/Users/ajay/Desktop/projects/baseil-ai-website/src/components/landing/Footer.tsx` (~line 143)

**Step 1: Add tracking to external links**

Currently only the GitHub link exists (placeholder `href="#"`). Add an onClick handler:

```ts
trackEvent('outbound_click', { url: href, link_text: 'github' })
```

This is minimal since there's only one external link placeholder. When real external links are added later, they should follow the same pattern.

**Step 2: Verify types**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/components/landing/Footer.tsx
git commit -m "feat: add outbound link click tracking"
```

---

### Task 7: Final verification

**Step 1: Full type check**

```bash
cd /Users/ajay/Desktop/projects/baseil-ai-website && npx tsc --noEmit
```

**Step 2: Build check**

```bash
npm run build
```

**Step 3: Manual dev check**

```bash
npm run dev
```

Open browser, check:
- No console errors
- GA script loads (check Network tab for gtag.js)
- Open GA4 DebugView (if measurement ID is set) to verify events fire
- Click CTAs → `cta_click` events
- Scroll through sections → `section_view` events
- Interact with sandbox → `sandbox_interact` events
