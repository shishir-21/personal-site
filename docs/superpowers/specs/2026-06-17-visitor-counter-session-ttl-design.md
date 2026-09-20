# Visitor Counter — Session-Pinned Live Counter

**Date:** 2026-06-17
**Status:** Approved (pending spec review)

## Problem

The visitor pill shows a *personal ordinal* ("You're visitor #1,207"). The client
stores `{ id, number }` in `localStorage` **forever** and never re-fetches, so a
returning visitor is frozen at their original number even as the real total climbs
far past it. The counter never tells the "...and it's still growing" half of the story.

## Goal

Turn the pill into a **single live counter that climbs whenever anyone opens the site**,
without inflating on reload-spam and without changing the number while a visitor is
actively looking at it.

## Behavior

A **session-pinned counter** with a 15-minute time-to-live:

- **First arrival:** register → receive the current number (you're the newest
  visitor) → display it.
- **Reload within the session window (< 15 min):** same number every time. No
  fetch, no increment. Reload-spam does nothing.
- **Reload after the window (≥ 15 min):** the session has expired → re-register →
  receive a fresh, higher number, and the global counter bumps.

The counter therefore counts **visit-sessions**, not unique humans — a returning
visitor (including the site owner) legitimately bumps it. The displayed number never
changes mid-view; it only jumps between sessions.

## Implementation

Scope is intentionally small. **The API and Postgres layer need no changes** —
dedup is already client-side; today's record simply lives forever instead of
expiring.

### `app/components/VisitorCounter.tsx` (only file changed)

1. **Extend the stored record** to
   `{ id: string; number: number; registeredAt: number; dismissed: boolean }`.
   - `registeredAt` — epoch ms stamped at registration, drives the TTL.
   - `dismissed` — folds the dismiss state *into the session record* so it resets
     automatically when the session expires (no separate forever-flag).

2. **Add a TTL constant:** `const SESSION_TTL_MS = 15 * 60 * 1000;` (easy to tweak to 10).

3. **On client module load** (replacing the current read-or-fetch logic):
   - Read the stored record. If it exists **and** `Date.now() - registeredAt < SESSION_TTL_MS`
     → reuse it as-is (this is the reload-spam guard).
   - Otherwise (missing or expired) → `POST /api/visitors` with no `id` to register
     fresh. On success, persist `{ id, number, registeredAt: Date.now(), dismissed: false }`
     and publish to the module store.
   - Failures still fail soft (pill simply doesn't appear), as today.

4. **Dismiss handler** sets `dismissed: true` on the current record, persists it, and
   updates the store — hidden for this session, reappears on the next session's fresh
   record. Remove the separate `DISMISSED_KEY` / `dismissedForever` state.

5. **Visibility:** `show = record !== null && !record.dismissed`.

6. **Roll-up animation:** when the number jumps between sessions, `RollingNumber`
   animates from the *previous* number to the new one (instead of the current fixed
   "start 60 below" behavior) so a returning visitor sees it climb. Carry the prior
   value (e.g. from the outgoing record) as the animation start; fall back to the
   existing seed-based start for a first-ever visit. Preserve the existing
   reduced-motion / hidden-tab `skip` path (jump straight to the value).

### Unchanged

- Copy: `"You're visitor #N"` — honest again, since the number is stable within a
  session and only the latest value is ever shown.
- `app/api/visitors/route.ts`, `app/lib/visitorCounter.ts`, Postgres RPCs.
- Pill layout/styling, the entrance spring, the purple dot, the dismiss button markup.

## Edge cases

- **localStorage cleared / new visitor:** no record → registers fresh (as today).
- **Hidden tab / reduced motion:** existing `skipEnter` / `skip` paths preserved —
  jump to value, no stalled animation.
- **Owner testing locally:** each return after 15 min bumps the counter by ~1; with
  real traffic it reflects everyone. This is the intended "grows when anyone opens it"
  semantic.
- **Clock skew / negative elapsed:** treat any record whose `registeredAt` is missing
  or in the future as expired → re-register.

## Testing

- `app/lib/visitorCounter.test.ts` covers the pure row-parsing helper (unchanged).
- The TTL decision is pure logic; if extracted to a small helper
  (`isSessionExpired(registeredAt, now)`), add a unit test via
  `node --import tsx --test` (repo has no test runner — see project memory).
- Manual: load → reload immediately (number stable), wait out TTL → reload (number
  bumps + rolls up), dismiss → reload within window (stays gone) → after window
  (reappears).
