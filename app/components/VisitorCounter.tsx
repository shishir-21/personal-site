// app/components/VisitorCounter.tsx
"use client";

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

export function VisitorCounter() {
  const record = useSyncExternalStore(
    subscribeToVisitor,
    getVisitorSnapshot,
    () => null,
  );
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

  return (
    <AnimatePresence>
      {show && (
        <m.div
          key="visitor-counter"
          // initial={false} renders straight at the `animate` state with no
          // entrance tween — used when the tab is hidden (rAF is paused) so the
          // pill is guaranteed visible the moment the tab is foregrounded.
          initial={
            record.skipEnter
              ? false
              : reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 12 }
          }
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={
            reduceMotion
              ? { duration: 0.15 }
              : { type: "spring", stiffness: 260, damping: 24 }
          }
          /* `!fixed` overrides the `position: relative` from the `.drama-shadow`
             utility (defined after @tailwind utilities, so it would otherwise win
             and drop the pill into normal flow at full width). `w-fit` keeps it
             pill-width regardless of the flow context. */
          className="drama-shadow !fixed right-4 z-50 flex w-fit items-center gap-2 rounded-full border border-border-primary bg-white px-3.5 py-2 text-[13px] text-text-secondary"
          style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >
          <span
            aria-hidden
            className="h-[7px] w-[7px] flex-none rounded-full bg-purple-primary shadow-[0_0_0_3px_rgba(108,71,255,0.15),0_0_10px_rgba(108,71,255,0.25)]"
          />
          <span className="hidden sm:inline">You&apos;re visitor&nbsp;</span>
          <span className="font-mono font-semibold tabular-nums text-purple-primary">
            {"#"}
            <RollingNumber
              value={record.number}
              from={record.prevNumber}
              skip={record.skipEnter}
            />
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
        </m.div>
      )}
    </AnimatePresence>
  );
}
