# Visitor Counter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a small floating pill that greets each unique visitor with their all-time visitor number ("You're #1,205"), counted in Upstash Redis, seeded at 1204.

**Architecture:** Three units. (1) A pure, Redis-agnostic counting module (`app/lib/visitorCounter.ts`) holding the seed/increment/lookup logic — unit-tested. (2) A thin Redis client factory (`app/db/redis.ts`) + an API route (`app/api/visitors/route.ts`) that wires the real Upstash client to the pure logic and fails silent. (3) A `"use client"` pill component (`app/components/VisitorCounter.tsx`) mounted in the root layout that dedupes per-browser via `localStorage` and animates in with framer-motion.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind, framer-motion, `@upstash/redis`, Node's built-in test runner via `tsx`.

---

## Testing approach (read first)

This repo has **no test runner** (no Jest/Vitest; Playwright is only used by link-preview scripts) and **zero existing tests**. To respect that pattern we do **not** add a React testing stack. Instead:

- **Pure counting logic** (the bug-prone part) is TDD'd with Node's built-in test runner run through `tsx` (already a dependency) — no new test infrastructure.
- **Route + pill + motion + responsiveness** are verified by running the real dev server and inspecting in the browser (Task 7), matching how this codebase is actually validated.

Test command used throughout: `node --import tsx --test app/lib/visitorCounter.test.ts`

---

## File structure

| File | Responsibility |
|---|---|
| `app/lib/visitorCounter.ts` (create) | Pure logic: `VISITOR_SEED`, types, `RedisLike` interface, `registerNewVisitor`, `lookupVisitor`. No Next/Upstash imports. |
| `app/lib/visitorCounter.test.ts` (create) | Node `test` unit tests using an in-memory fake Redis. |
| `app/db/redis.ts` (create) | `getRedis()` — builds an Upstash `Redis` client from env, or returns `null` if env is absent. |
| `app/api/visitors/route.ts` (create) | `POST` boundary: returns existing record for a known id, else registers a new visitor; fails silent. |
| `app/components/VisitorCounter.tsx` (create) | The floating pill: local dedup, fetch, count-up + slide-in motion, dismiss, responsive text. |
| `app/layout.tsx` (modify) | Mount `<VisitorCounter />` once so it appears on every route. |
| `.env.example` (create) | Document the two Upstash env vars. |
| `package.json` (modify) | Add `@upstash/redis` dep and a `test` script. |

---

### Task 1: Pure counting logic — failing tests first

**Files:**
- Create: `app/lib/visitorCounter.test.ts`
- Create (next task): `app/lib/visitorCounter.ts`

- [ ] **Step 1: Write the failing test file**

```ts
// app/lib/visitorCounter.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  VISITOR_SEED,
  registerNewVisitor,
  lookupVisitor,
  type RedisLike,
} from "./visitorCounter";

// In-memory Redis double that honours the subset of commands we use.
function makeFakeRedis(): RedisLike & { dump: () => Map<string, number> } {
  const store = new Map<string, number>();
  return {
    async set(key, value, opts) {
      if (opts?.nx && store.has(key)) return null;
      store.set(key, value);
      return "OK";
    },
    async incr(key) {
      const next = (store.get(key) ?? 0) + 1;
      store.set(key, next);
      return next;
    },
    async get(key) {
      return store.has(key) ? (store.get(key) as number) : null;
    },
    dump: () => store,
  };
}

test("seed is 1204", () => {
  assert.equal(VISITOR_SEED, 1204);
});

test("first new visitor is seed + 1 and gets a stored record", async () => {
  const redis = makeFakeRedis();
  let n = 0;
  const record = await registerNewVisitor(redis, () => `id-${++n}`);
  assert.deepEqual(record, { id: "id-1", number: 1205 });
  assert.equal(redis.dump().get("visitors:count"), 1205);
  assert.equal(redis.dump().get("visitor:id-1"), 1205);
});

test("subsequent visitors increment without re-seeding", async () => {
  const redis = makeFakeRedis();
  let n = 0;
  const make = () => `id-${++n}`;
  const a = await registerNewVisitor(redis, make);
  const b = await registerNewVisitor(redis, make);
  assert.equal(a.number, 1205);
  assert.equal(b.number, 1206);
  assert.notEqual(a.id, b.id);
});

test("seed is only applied once even if count already exists", async () => {
  const redis = makeFakeRedis();
  await redis.set("visitors:count", 5000);
  const record = await registerNewVisitor(redis, () => "id-x");
  assert.equal(record.number, 5001); // incremented, not reset to seed
});

test("lookupVisitor returns the stored record for a known id", async () => {
  const redis = makeFakeRedis();
  const created = await registerNewVisitor(redis, () => "known");
  const found = await lookupVisitor(redis, "known");
  assert.deepEqual(found, created);
});

test("lookupVisitor returns null for an unknown id", async () => {
  const redis = makeFakeRedis();
  const found = await lookupVisitor(redis, "missing");
  assert.equal(found, null);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --import tsx --test app/lib/visitorCounter.test.ts`
Expected: FAIL — module `./visitorCounter` cannot be resolved (file does not exist yet).

- [ ] **Step 3: Commit the failing test**

```bash
git add app/lib/visitorCounter.test.ts
git commit -m "test: visitor counting logic (red)"
```

---

### Task 2: Pure counting logic — implementation

**Files:**
- Create: `app/lib/visitorCounter.ts`
- Test: `app/lib/visitorCounter.test.ts`

- [ ] **Step 1: Write the implementation**

```ts
// app/lib/visitorCounter.ts
// Pure, Redis-agnostic visitor counting. No Next.js or Upstash imports here so
// it stays trivially unit-testable with an in-memory fake.

export const VISITOR_SEED = 1204;

const COUNT_KEY = "visitors:count";
const visitorKey = (id: string) => `visitor:${id}`;

export type VisitorRecord = {
  id: string;
  number: number;
};

// The subset of Redis commands this module needs. Both the real Upstash client
// and the test fake satisfy this shape.
export type RedisLike = {
  set(
    key: string,
    value: number,
    opts?: { nx?: boolean },
  ): Promise<unknown>;
  incr(key: string): Promise<number>;
  get(key: string): Promise<number | null>;
};

// Register a brand-new visitor: seed the counter once, increment it, and persist
// the visitor's assigned number so return visits are stable.
export async function registerNewVisitor(
  redis: RedisLike,
  makeId: () => string,
): Promise<VisitorRecord> {
  await redis.set(COUNT_KEY, VISITOR_SEED, { nx: true });
  const number = await redis.incr(COUNT_KEY);
  const id = makeId();
  await redis.set(visitorKey(id), number);
  return { id, number };
}

// Look up an existing visitor by id. Returns null if we have no record for them.
export async function lookupVisitor(
  redis: RedisLike,
  id: string,
): Promise<VisitorRecord | null> {
  const number = await redis.get(visitorKey(id));
  if (number === null || number === undefined) return null;
  return { id, number };
}
```

- [ ] **Step 2: Run the tests to verify they pass**

Run: `node --import tsx --test app/lib/visitorCounter.test.ts`
Expected: PASS — all 6 tests pass.

- [ ] **Step 3: Commit**

```bash
git add app/lib/visitorCounter.ts
git commit -m "feat: visitor counting logic (green)"
```

---

### Task 3: Upstash Redis client factory + dependency

**Files:**
- Modify: `package.json`
- Create: `app/db/redis.ts`
- Create: `.env.example`

- [ ] **Step 1: Install the Upstash Redis SDK**

Run: `npm install @upstash/redis`
Expected: `@upstash/redis` is added to `dependencies` in `package.json` and `package-lock.json` updates.

- [ ] **Step 2: Add a `test` script to `package.json`**

In `package.json`, add to the `"scripts"` block (next to the existing `lint` script):

```json
    "test": "node --import tsx --test app/lib/visitorCounter.test.ts",
```

- [ ] **Step 3: Create the Redis client factory**

```ts
// app/db/redis.ts
import { Redis } from "@upstash/redis";
import type { RedisLike } from "app/lib/visitorCounter";

// Returns an Upstash client, or null when env vars are absent (local dev without
// credentials, or a misconfigured deploy). Callers treat null as "counter off".
export function getRedis(): RedisLike | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token }) as unknown as RedisLike;
}
```

- [ ] **Step 4: Create `.env.example` documenting the vars**

```bash
# Upstash Redis (https://console.upstash.com) — powers the visitor counter.
# Copy this file to .env.local and fill in values from your Upstash database's
# "REST API" section. Without these, the visitor counter silently does nothing.
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

- [ ] **Step 5: Verify the project still type-checks and builds the route graph**

Run: `npx tsc --noEmit`
Expected: PASS — no type errors. (`getRedis` returning `RedisLike | null` matches the route's usage in Task 4.)

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json app/db/redis.ts .env.example
git commit -m "feat: add @upstash/redis client factory and env docs"
```

---

### Task 4: API route

**Files:**
- Create: `app/api/visitors/route.ts`

- [ ] **Step 1: Write the route handler**

```ts
// app/api/visitors/route.ts
import { NextResponse } from "next/server";
import { getRedis } from "app/db/redis";
import { registerNewVisitor, lookupVisitor } from "app/lib/visitorCounter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { id?: string }
//  - known id  -> return the existing record, do NOT increment
//  - no/unknown id -> register a new visitor
// Always fails soft: any missing-config or Redis error returns { ok: false } so
// the page is never broken by the counter.
export async function POST(request: Request) {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ ok: false });

  try {
    const body = (await request.json().catch(() => ({}))) as { id?: unknown };
    const id = typeof body.id === "string" ? body.id : null;

    if (id) {
      const existing = await lookupVisitor(redis, id);
      if (existing) return NextResponse.json({ ok: true, ...existing });
    }

    const record = await registerNewVisitor(redis, () => crypto.randomUUID());
    return NextResponse.json({ ok: true, ...record });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Manually verify the route fails soft with no env**

Run (in one terminal): `npm run dev`
Run (in another): `curl -s -X POST http://localhost:3000/api/visitors -H 'content-type: application/json' -d '{}'`
Expected (no Upstash env set locally yet): `{"ok":false}` — confirms the soft-fail path. Stop the dev server afterward.

- [ ] **Step 4: Commit**

```bash
git add app/api/visitors/route.ts
git commit -m "feat: /api/visitors register + lookup route"
```

---

### Task 5: VisitorCounter pill component

**Files:**
- Create: `app/components/VisitorCounter.tsx`

- [ ] **Step 1: Write the component**

```tsx
// app/components/VisitorCounter.tsx
"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import { VISITOR_SEED } from "app/lib/visitorCounter";

const STORAGE_KEY = "visitorCounter";
const DISMISSED_KEY = "visitorCounterDismissed";

type Stored = { id: string; number: number };

function readStored(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (typeof parsed?.number === "number" && typeof parsed?.id === "string") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

// Animated, comma-formatted number that rolls up to its final value once.
function RollingNumber({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  const start = reduceMotion ? value : Math.max(VISITOR_SEED, value - 60);
  const count = useMotionValue(start);
  const text = useTransform(count, (v) =>
    Math.round(v).toLocaleString("en-US"),
  );

  useEffect(() => {
    if (reduceMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 0.9, ease: "easeOut" });
    return controls.stop;
  }, [value, reduceMotion, count]);

  return <motion.span>{text}</motion.span>;
}

export function VisitorCounter() {
  const [record, setRecord] = useState<Stored | null>(null);
  const [dismissed, setDismissed] = useState(true); // hidden until we decide to show
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    const wasDismissed = localStorage.getItem(DISMISSED_KEY) === "1";

    async function ensureRecord() {
      const existing = readStored();
      if (existing) {
        if (!cancelled) {
          setRecord(existing);
          setDismissed(wasDismissed);
        }
        return;
      }
      // New browser: register (counts the visit) even if previously dismissed,
      // so the global count stays accurate.
      try {
        const res = await fetch("/api/visitors", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = (await res.json()) as
          | { ok: true; id: string; number: number }
          | { ok: false };
        if (!data.ok) return; // soft-fail: render nothing
        const next = { id: data.id, number: data.number };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        if (!cancelled) {
          setRecord(next);
          setDismissed(wasDismissed);
        }
      } catch {
        // network error: render nothing
      }
    }

    void ensureRecord();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  }

  const show = record !== null && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="visitor-counter"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={
            reduceMotion
              ? { duration: 0.15 }
              : { type: "spring", stiffness: 260, damping: 24 }
          }
          className="drama-shadow fixed right-4 z-50 flex items-center gap-2 rounded-full border border-border-primary bg-white px-3.5 py-2 text-[13px] text-text-secondary"
          style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >
          <span
            aria-hidden
            className="h-[7px] w-[7px] flex-none rounded-full bg-purple-primary shadow-[0_0_0_3px_rgba(108,71,255,0.15),0_0_10px_rgba(108,71,255,0.25)]"
          />
          <span className="hidden sm:inline">You&apos;re&nbsp;</span>
          <span className="font-mono font-semibold tabular-nums text-purple-primary">
            #<RollingNumber value={record!.number} />
          </span>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss visitor counter"
            className="-mr-1 ml-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full text-text-tertiary transition-colors hover:text-text-primary"
          >
            <svg viewBox="0 0 14 14" className="h-3 w-3" aria-hidden>
              <path
                d="M3.5 3.5l7 7M10.5 3.5l-7 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/components/VisitorCounter.tsx
git commit -m "feat: VisitorCounter floating pill component"
```

---

### Task 6: Mount in the root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add the import**

In `app/layout.tsx`, add alongside the other component imports (after the `Footer` import on line 5):

```tsx
import { VisitorCounter } from "./components/VisitorCounter";
```

- [ ] **Step 2: Render the pill inside `<main>`, after `<Footer />`**

Change the closing of the `<main>` block from:

```tsx
          <Footer />
        </main>
```

to:

```tsx
          <Footer />
          <VisitorCounter />
        </main>
```

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS, no errors.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: mount VisitorCounter in root layout"
```

---

### Task 7: End-to-end verification in the browser

This task has no code — it validates the running feature. Requires a real Upstash database.

- [ ] **Step 1: Create a free Upstash Redis database**

Go to https://console.upstash.com → create a Redis database (any region). From its **REST API** section, copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

- [ ] **Step 2: Add credentials locally**

Create `.env.local` (gitignored) with:

```bash
UPSTASH_REDIS_REST_URL=https://<your-db>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<your-token>
```

- [ ] **Step 3: Run the app and verify a new visitor**

Run: `npm run dev`
- Open http://localhost:3000 in a fresh/incognito browser.
- Expected: the pill slides up bottom-right, the number rolls up and settles on **#1,205** (seed 1204 + first visitor). On desktop it reads "You're #1,205"; narrow the window below `sm` (640px) and it collapses to dot + "#1,205".

- [ ] **Step 4: Verify dedup on reload**

- Reload the page.
- Expected: the pill shows the **same** number (#1,205) and the Network tab shows **no** new `POST /api/visitors` (it reads from `localStorage`).

- [ ] **Step 5: Verify a second unique visitor increments**

- Open the site in a different browser/incognito profile.
- Expected: pill shows **#1,206**.

- [ ] **Step 6: Verify dismiss**

- Click the × on the pill.
- Expected: pill animates out. Reload → it stays hidden. Confirm `localStorage.visitorCounterDismissed === "1"`. (Clearing site data brings it back.)

- [ ] **Step 7: Verify reduced motion**

- Enable OS "Reduce motion" (macOS: System Settings → Accessibility → Display → Reduce motion), reload in a profile without a stored record.
- Expected: pill fades in with no slide and the number appears without rolling.

- [ ] **Step 8: Production env + deploy**

- Add the same two env vars in Vercel (Project → Settings → Environment Variables, all environments).
- Deploy the branch (or merge to `v4`). Verify the pill works on the deployed URL.

---

## Self-review (completed by plan author)

**Spec coverage:**
- Total all-time count → `visitors:count` INCR (Task 2). ✓
- Unique visitors only, per-browser dedup → `localStorage` record + no-POST on reload (Task 5, verified Task 7 Step 4). ✓
- Seed 1204, first visitor 1205 → `registerNewVisitor` + test (Tasks 1–2), verified Task 7 Step 3. ✓
- Upstash Redis backend → Tasks 3–4. ✓
- Fails silent → `getRedis()` null + route try/catch + client soft-fail (Tasks 3–5, verified Task 4 Step 3). ✓
- Floating pill bottom-right, every page → layout mount (Task 6). ✓
- Style 3 (white drama-shadow, purple mono number, pulse dot, dismiss ×) → Task 5. ✓
- Mobile: full text desktop / number-only `<sm`, safe-area inset → Task 5 (`hidden sm:inline`, `env(safe-area-inset-bottom)`), verified Task 7 Step 3. ✓
- Motion: spring slide-in + number roll; reduced-motion fade only → Task 5, verified Task 7 Steps 3 & 7. ✓
- SSR safety (render nothing until mounted) → component starts `dismissed=true`, only shows after `useEffect`; no SSR/client divergence. ✓
- Testing proportional → pure-logic unit tests (Tasks 1–2) + browser verification (Task 7). ✓ (Deviation from spec's "component test" noted in Testing approach — repo has no runner.)

**Placeholder scan:** No TBD/TODO/"handle edge cases"; all code blocks complete.

**Type consistency:** `VisitorRecord {id, number}`, `RedisLike {set,incr,get}`, `VISITOR_SEED`, keys `visitors:count` / `visitor:{id}`, storage keys `visitorCounter` / `visitorCounterDismissed`, route shape `{ok, id, number}` — consistent across Tasks 1–6.
