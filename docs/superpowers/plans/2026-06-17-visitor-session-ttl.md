# Session-Pinned Visitor Counter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the visitor pill a single live counter that climbs whenever anyone opens the site, pinned per 15-minute session so reload-spam never bumps it.

**Architecture:** The increment dedup is already client-side — today's localStorage record lives forever, freezing the visitor at their first number. We add a 15-minute TTL: a fresh record is reused as-is; a missing/expired one triggers a re-registration (`POST /api/visitors`, which bumps the global counter) and yields a higher number. Legacy records without `registeredAt` are treated as expired while still preserving their number as the roll-up start. The dismiss state folds into the session record so it resets each session. The number rolls up from the previous value when it jumps between sessions. No API or Postgres changes.

**Tech Stack:** Next.js 15 App Router, React 18 client component, framer-motion, Supabase (unchanged), `node --import tsx --test` for the pure-logic test.

**Spec:** `docs/superpowers/specs/2026-06-17-visitor-counter-session-ttl-design.md`

---

## File Structure

- **Modify** `app/lib/visitorCounter.ts` — add `SESSION_TTL_MS` constant and the pure `isSessionExpired()` helper (keeps TTL logic dependency-free and unit-testable).
- **Modify** `app/lib/visitorCounter.test.ts` — add unit tests for `isSessionExpired()`.
- **Modify** `app/components/VisitorCounter.tsx` — give the stored record a `registeredAt` + `dismissed`, gate reuse on the TTL, fold dismiss into the record, and roll the number up from the previous value.

No files are created. The API route, the Postgres RPCs, and the pill markup/styling stay as-is.

---

## Task 1: Pure session-expiry helper

**Files:**

- Modify: `app/lib/visitorCounter.ts`
- Test: `app/lib/visitorCounter.test.ts`

- [ ] **Step 1: Write the failing tests**

Append to `app/lib/visitorCounter.test.ts`:

```ts
import { SESSION_TTL_MS, isSessionExpired } from "./visitorCounter";

test("SESSION_TTL_MS is 15 minutes", () => {
  assert.equal(SESSION_TTL_MS, 15 * 60 * 1000);
});

test("isSessionExpired: fresh record within the window is not expired", () => {
  const now = 1_000_000_000;
  assert.equal(isSessionExpired(now - 60_000, now), false); // 1 min ago
});

test("isSessionExpired: record at/after the TTL boundary is expired", () => {
  const now = 1_000_000_000;
  assert.equal(isSessionExpired(now - SESSION_TTL_MS, now), true); // exactly TTL old
  assert.equal(isSessionExpired(now - SESSION_TTL_MS - 1, now), true); // older
});

test("isSessionExpired: missing/invalid timestamp is treated as expired", () => {
  const now = 1_000_000_000;
  assert.equal(isSessionExpired(undefined, now), true);
  assert.equal(isSessionExpired(Number.NaN, now), true);
});

test("isSessionExpired: future timestamp (clock skew) is treated as expired", () => {
  const now = 1_000_000_000;
  assert.equal(isSessionExpired(now + 5_000, now), true);
});
```

Note: the existing test file already imports `test`, `assert`, `VISITOR_SEED`, and `parseVisitorRow` at the top. Add the new `import { SESSION_TTL_MS, isSessionExpired } from "./visitorCounter";` line next to that existing import rather than duplicating the `node:test`/`assert` imports.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm test`
Expected: FAIL — `SESSION_TTL_MS`/`isSessionExpired` are `undefined` (not exported yet), so the new assertions throw.

- [ ] **Step 3: Add the constant and helper**

Append to `app/lib/visitorCounter.ts` (after the existing `parseVisitorRow` function):

```ts
// A visitor's number is "pinned" for one session. While a stored record is within
// this window it is reused as-is (so reloads don't bump the counter); once it
// expires, the next load re-registers and the counter climbs.
export const SESSION_TTL_MS = 15 * 60 * 1000;

// True when the caller should re-register (no usable timestamp, a future timestamp
// from clock skew, or one at/older than the TTL). Pure so it can be unit-tested.
export function isSessionExpired(
  registeredAt: number | undefined,
  now: number,
): boolean {
  if (typeof registeredAt !== "number" || !Number.isFinite(registeredAt))
    return true;
  const elapsed = now - registeredAt;
  if (elapsed < 0) return true; // future timestamp => treat as expired
  return elapsed >= SESSION_TTL_MS;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test`
Expected: PASS — all existing tests plus the five new `isSessionExpired`/`SESSION_TTL_MS` assertions.

- [ ] **Step 5: Commit**

This task is a pure helper + tests (deliberately trivial), so the codex-review gate can be bypassed:

```bash
git add app/lib/visitorCounter.ts app/lib/visitorCounter.test.ts
CODEX_SKIP_REVIEW=1 git commit -m "feat: add session-expiry helper for visitor counter

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Wire TTL, session-scoped dismiss, and roll-up into the component

**Files:**

- Modify: `app/components/VisitorCounter.tsx`

This task has no automated test (client component using `localStorage`, `document.hidden`, and framer-motion; the repo has no component test runner). Verify via typecheck, lint, and a manual browser check.

- [ ] **Step 1: Replace the imports and storage block**

In `app/components/VisitorCounter.tsx`, replace the top imports + storage/types/module-store block (current lines 4–65, from the framer-motion import down through the closing `}` of the `if (typeof window !== "undefined")` block) with:

```tsx
import {
  AnimatePresence,
  animate,
  m,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useSyncExternalStore } from "react";
import { VISITOR_SEED, isSessionExpired } from "app/lib/visitorCounter";

const STORAGE_KEY = "visitorCounter";

// Shape persisted to localStorage. `dismissed` lives here (not in a separate
// forever-flag) so it resets automatically when the session expires.
type Persisted = {
  id: string;
  number: number;
  registeredAt: number;
  dismissed: boolean;
};

// Runtime record published to the component. `skipEnter` suppresses the entrance
// tween when the tab is hidden; `prevNumber` is the value to roll up FROM when the
// number jumps between sessions (undefined on a first-ever visit).
type Stored = Persisted & { skipEnter: boolean; prevNumber?: number };

function readStored(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    const { id, number, registeredAt, dismissed } = parsed;
    if (
      typeof id !== "string" ||
      typeof number !== "number" ||
      !Number.isFinite(number)
    ) {
      return null;
    }

    return {
      id,
      number,
      // Legacy records did not include a timestamp. Keep their number available
      // as the roll-up start, but force a fresh registration.
      registeredAt:
        typeof registeredAt === "number" && Number.isFinite(registeredAt)
          ? registeredAt
          : 0,
      dismissed: dismissed === true,
    };
  } catch {
    return null;
  }
}

// Module-level store — runs once at client module load, never in an effect.
let visitorRecord: Stored | null = null;
const visitorListeners = new Set<() => void>();

function subscribeToVisitor(cb: () => void) {
  visitorListeners.add(cb);
  return () => visitorListeners.delete(cb);
}

function getVisitorSnapshot() {
  return visitorRecord;
}

function publish(record: Stored) {
  visitorRecord = record;
  visitorListeners.forEach((fn) => fn());
}

if (typeof window !== "undefined") {
  const existing = readStored();
  if (existing && !isSessionExpired(existing.registeredAt, Date.now())) {
    // Within the 15-min window: reuse as-is. No fetch, no counter bump.
    visitorRecord = { ...existing, skipEnter: document.hidden };
  } else {
    // Missing or expired session: register a fresh visit (this bumps the global
    // counter). We intentionally send no id so the server increments rather than
    // looking up the old record. The prior number, if any, is the roll-up start.
    const prevNumber = existing?.number;
    fetch("/api/visitors", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then(
        (data: { ok: true; id: string; number: number } | { ok: false }) => {
          if (!data.ok) return;
          const persisted: Persisted = {
            id: data.id,
            number: data.number,
            registeredAt: Date.now(),
            dismissed: false,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
          publish({ ...persisted, skipEnter: document.hidden, prevNumber });
        },
      )
      .catch(() => {});
  }
}
```

- [ ] **Step 2: Update `RollingNumber` to accept a roll-up start**

Replace the `RollingNumber` function (current lines 71–90) with:

```tsx
// Animated, comma-formatted number that rolls up to its final value once.
// `from` is where the roll starts — the previous session's number when the count
// jumped, otherwise a seed-based start for a first-ever visit. `skip` (reduced
// motion, or tab hidden so rAF is paused) jumps straight to the final value.
function RollingNumber({
  value,
  from,
  skip,
}: {
  value: number;
  from?: number;
  skip?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const noAnim = skip || reduceMotion;
  const start = noAnim ? value : (from ?? Math.max(VISITOR_SEED, value - 60));
  const count = useMotionValue(start);
  const text = useTransform(count, (v) =>
    Math.round(v).toLocaleString("en-US"),
  );

  useEffect(() => {
    if (noAnim) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 0.9, ease: "easeOut" });
    return controls.stop;
  }, [value, noAnim, count]);

  return <m.span>{text}</m.span>;
}
```

- [ ] **Step 3: Update the component to read dismiss from the record**

Replace the component body from `export function VisitorCounter() {` through the `const show = ...` line (current lines 92–104) with:

```tsx
export function VisitorCounter() {
  const record = useSyncExternalStore(subscribeToVisitor, getVisitorSnapshot, () => null);
  const reduceMotion = useReducedMotion();

  function handleDismiss() {
    if (!record) return;
    const persisted: Persisted = {
      id: record.id,
      number: record.number,
      registeredAt: record.registeredAt,
      dismissed: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    publish({ ...persisted, skipEnter: true });
  }

  const show = record !== null && !record.dismissed;
```

(The `reduceMotion` line is unchanged from the original; keep the rest of the JSX below `const show = ...` exactly as it is.)

- [ ] **Step 4: Pass `prevNumber` into the rendered number**

In the JSX, update the `RollingNumber` usage (current line 137) from:

```tsx
#<RollingNumber value={record.number} skip={record.skipEnter} />
```

to:

```tsx
#<RollingNumber value={record.number} from={record.prevNumber} skip={record.skipEnter} />
```

- [ ] **Step 5: Typecheck and lint**

Run: `npx tsc --noEmit`
Expected: no errors. In particular, confirm there are no remaining references to the removed `DISMISSED_KEY` constant or the removed `useState` import (both deleted in Step 1/Step 3).

Run: `pnpm lint`
Expected: no new lint errors.

- [ ] **Step 6: Manual browser verification**

Run: `pnpm dev`, open the site in a cmux browser pane on the right (per `~/work/CLAUDE.md` §3), and verify:

1. **First load:** pill appears, number rolls up to the current value.
2. **Reload immediately:** same number, no change (within the 15-min window).
3. **Expire the session without waiting 15 min:** in DevTools console run
   `JSON.parse(localStorage.visitorCounter)` to confirm the shape
   `{id, number, registeredAt, dismissed}`, then
   `localStorage.visitorCounter = JSON.stringify({ ...JSON.parse(localStorage.visitorCounter), registeredAt: 0 })`
   and reload. Expected: the counter bumps to a higher number and **rolls up from the previous value**.
4. **Dismiss (×):** pill disappears. Reload within the window → stays gone.
   Force-expire again (set `registeredAt: 0`) and reload → pill reappears.

- [ ] **Step 7: Codex review, then commit**

This is non-trivial component logic, so the codex-review gate applies (per `~/work/CLAUDE.md` §2). From the repo root run `codex-review`, wait on it with `codex-wait <job-dir>` (background), apply any good fixes, then commit:

```bash
git add app/components/VisitorCounter.tsx
git commit -m "feat: session-pin the visitor counter with a 15-min TTL

Reuse the stored visitor number within a 15-minute window so reloads
don't bump the count; re-register (and roll the number up) once the
session expires. Dismiss state now lives in the session record so it
resets each session instead of being permanent.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**

- Session-pinned 15-min TTL → Task 1 (`SESSION_TTL_MS`, `isSessionExpired`) + Task 2 Step 1 (gate reuse on it). ✓
- Reload within window = same number, no bump → Task 2 Step 1 (reuse branch, no fetch). ✓
- Reload after window = re-register + higher number → Task 2 Step 1 (expired branch, `POST` with empty body). ✓
- Counts visit-sessions (owner returns bump it) → falls out of the empty-body `register_visitor` call. ✓
- Dismiss folds into record, resets next session → Task 2 Step 1 (`dismissed` in `Persisted`) + Step 3 (`handleDismiss`, `show`). ✓
- Roll-up from previous number → Task 2 Step 2 (`from` prop) + Step 4 (`prevNumber` passed). ✓
- Reduced-motion / hidden-tab `skip` preserved → Task 2 Step 2 (`noAnim` path kept). ✓
- API / Postgres / copy / styling unchanged → no tasks touch them. ✓
- Clock-skew / missing timestamp = expired → Task 1 (`isSessionExpired` guards). ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code. ✓

**Type consistency:** `Persisted` and `Stored` defined once in Task 2 Step 1 and used consistently in `readStored`, `publish`, `handleDismiss`, and the fetch handler. `isSessionExpired(registeredAt, now)` / `SESSION_TTL_MS` signatures match between Task 1's definition and Task 2's usage. `RollingNumber`'s `from` prop (Step 2) matches the `record.prevNumber` passed in (Step 4). ✓
