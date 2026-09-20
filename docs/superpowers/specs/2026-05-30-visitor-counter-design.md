# Visitor Counter — Design

**Date:** 2026-05-30
**Status:** Implemented
**Site:** hardeep.cv (Next.js 15 App Router, Tailwind, framer-motion, deployed on Vercel)

> **Addendum (2026-05-31): Backend changed from Upstash Redis to Supabase Postgres.**
> The user opted for Supabase (already familiar, reachable via MCP). The architecture
> is otherwise unchanged: the browser still talks to our server-side `/api/visitors`
> route; only the storage layer differs. On Supabase the atomic seed/increment is a
> Postgres **sequence** (`visitor_number_seq`, starting at 1205) plus a `visitors`
> table, wrapped in a `SECURITY DEFINER` `register_visitor()` RPC (and `lookup_visitor()`),
> granted to `service_role` only. RLS is enabled with no policies (deny-all to
> anon/authenticated); the route uses the server-only `SUPABASE_SERVICE_ROLE_KEY`.
> Schema captured at `supabase/migrations/20260530000000_visitor_counter.sql`.
> Where this doc says "Upstash / Redis / INCR" below, read "Supabase / Postgres / RPC".
>
> One implementation addition found during live browser testing: framer-motion's
> rAF-driven entrance and number roll-up pause while a tab is backgrounded, which
> could leave the pill stuck invisible / showing the seed number. The component now
> detects `document.hidden` at reveal time and renders directly at the final state
> (`initial={false}` + `RollingNumber skip`) in that case.

## Summary

A small floating pill, pinned bottom-right on every page, that greets each unique
visitor with their all-time number: *"You're #12,345"*. It counts **unique visitors
only** (deduped per browser via `localStorage`), starts from a **seed of 1204**, and
persists the global count in **Upstash Redis**.

## Decisions (locked during brainstorming)

| Question | Decision |
|---|---|
| Counter type | Total all-time count (cumulative, only goes up) |
| What counts | Unique visitors only (deduped per browser) |
| Day-one number | Start from a seed |
| Seed value | **1204** (next new visitor becomes #1205) |
| Backend | Upstash Redis (atomic `INCR` + one key per visitor) |
| Placement | Floating pill, bottom-right, every page |
| Style | White "drama-shadow" pill, purple `#6C47FF` number (style 3) |
| Mobile | Full text on desktop; dot + number only on `<sm` |

## Design tokens used (from the existing site)

- Pill radius: `rounded-full`
- Signature card treatment `.drama-shadow`: `shadow-md` + `ring-1 ring-indigo-500/15`
  + inset white highlight `shadow-[inset_0_0_2px_1px_#ffffff4d]`
- Accent: `purple-primary` `#6C47FF` (and the TOC's glowing purple pulse-dot)
- Borders: `border-primary` `#D6DADE`; surface `bg-primary` `#F7F7F8`
- Fonts: Geist Sans / Geist Mono; numbers use Geist Mono with `tabular-nums`

## Architecture

Three units, each independently understandable and testable:

1. **Redis access + counting logic** — server-only module wrapping Upstash.
2. **API route** — HTTP boundary that registers/looks up a visitor.
3. **`VisitorCounter` client component** — the pill UI + local dedup + motion.

### 1. Counting logic + Redis (`app/db/visitors.ts`)

- Dependency: `@upstash/redis` (serverless REST client).
- Env: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
- Config constant: `VISITOR_SEED = 1204`.
- Keys:
  - `visitors:count` — the global integer counter.
  - `visitor:{uuid}` — the number assigned to a specific browser, so return visits
    are stable.
- `registerNewVisitor()`:
  1. `SET visitors:count <seed> NX` (seeds once; no-op if already set).
  2. `INCR visitors:count` → the new visitor's number.
  3. Mint a `uuid`, `SET visitor:{uuid} <number>`.
  4. Return `{ id, number }`.
- `getVisitor(id)`: `GET visitor:{id}` → `{ id, number }` or `null` if unknown.
- All functions are defensive: on any Redis/config error they throw, and the caller
  (route) converts that into a soft empty response.

### 2. API route (`app/api/visitors/route.ts`, Node runtime)

- `POST` with optional `{ id }` in the body:
  - No `id` (or unknown `id`) → `registerNewVisitor()`.
  - Known `id` → `getVisitor(id)`, **no increment**.
- Returns `{ id, number }` on success.
- **Fails silent:** if env is missing or Redis errors, respond `200 { ok: false }`
  (or `204`) so the client simply renders nothing. The page must never break because
  of the counter.

### 3. Client component (`app/components/VisitorCounter.tsx`)

- `"use client"`, mounted once in `app/layout.tsx` so it appears on every route.
- Mount flow:
  - Read `localStorage.visitorCounter` = `{ id, number }`.
  - If present → render the saved number immediately, **no network call**.
  - If absent → `POST /api/visitors`, store `{ id, number }`, then animate in.
  - If the user previously dismissed (`localStorage.visitorCounterDismissed`),
    still register the visit (so the count stays accurate) but do not show the pill.
- Renders `null` during SSR / before mount to avoid hydration mismatch; pops in after.
- Uses plain `fetch` (one-shot POST). SWR is available but unnecessary here.

## Visual & motion

- White pill, `rounded-full`, `.drama-shadow`. Purple `#6C47FF` pulse-dot on the left
  (mirrors the TOC indicator: small dot with soft purple glow ring). Number in Geist
  Mono, `tabular-nums`, purple. Small dismiss `×` on the right.
- Position: `fixed bottom-4 right-4 z-50`; add `env(safe-area-inset-bottom)` padding on
  mobile so it clears the home indicator.
- Entrance: framer-motion spring — slide up + fade once the number is known; the number
  does a brief odometer roll-up to its final value.
- Dismiss: fade + slide down, then set `localStorage.visitorCounterDismissed`.
- Responsive: desktop shows "You're #12,345"; `<sm` collapses to dot + "#12,345".
- `prefers-reduced-motion`: skip the roll and slide; fade only.

## Error handling

- Missing env / Redis down → route returns soft empty → pill renders nothing. No error
  surfaces to the user; the rest of the site is unaffected.
- Unknown/evicted `visitor:{id}` on a returning visitor → treat as a soft empty (client
  keeps showing its locally stored number; does not re-increment).

## Testing (proportional — Playwright is already a dependency)

- Component: mock the API →
  - new visitor: pill renders with the returned number and animates in;
  - dismiss: pill disappears and the flag is set;
  - returning visitor (seeded `localStorage`): shows the stored number, makes no POST.
- Route/logic unit test: new vs returning; seed-then-increment yields `seed + 1` for the
  first new visitor.

## Out of scope (YAGNI)

- Live "N online now" concurrent count.
- Per-page counts.
- Server-side IP/fingerprint dedup (client `localStorage` dedup is sufficient here).
- Admin/analytics dashboard.
