// app/lib/visitorCounter.ts
// Pure, dependency-free visitor-counting helpers. No Next.js or Supabase imports
// here so it stays trivially unit-testable.
//
// The atomic seed/increment logic lives in Postgres (a sequence + the
// `register_visitor()` RPC), so this module's only real job is to validate and
// normalize the row the RPC returns. The sequence starts at VISITOR_SEED + 1,
// so the first registered visitor is #1205.

export const VISITOR_SEED = 1204;

export type VisitorRecord = {
  id: string;
  number: number;
};

// Validate + normalize a single row returned by register_visitor()/lookup_visitor().
// Postgres `bigint` arrives as a string over the wire, so `number` is coerced.
// Returns null for any malformed/missing input (callers treat null as "no record").
export function parseVisitorRow(row: unknown): VisitorRecord | null {
  if (row === null || typeof row !== "object") return null;
  const { id, number } = row as { id?: unknown; number?: unknown };
  if (typeof id !== "string") return null;
  if (typeof number !== "string" && typeof number !== "number") return null;
  const n = Number(number);
  if (!Number.isFinite(n)) return null;
  return { id, number: n };
}

// A visitor's number is "pinned" for one session. While a stored record is within
// this window it is reused as-is (so reloads don't bump the counter); once it
// expires, the next load re-registers and the counter climbs.
export const SESSION_TTL_MS = 15 * 60 * 1000;

// True when the caller should re-register (no usable timestamp, a future timestamp
// from clock skew, or one at/older than the TTL). Pure so it can be unit-tested.
export function isSessionExpired(registeredAt: number | undefined, now: number): boolean {
  if (typeof registeredAt !== "number" || !Number.isFinite(registeredAt)) return true;
  const elapsed = now - registeredAt;
  if (elapsed < 0) return true; // future timestamp => treat as expired
  return elapsed >= SESSION_TTL_MS;
}
