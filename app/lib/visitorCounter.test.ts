// app/lib/visitorCounter.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { VISITOR_SEED, parseVisitorRow, SESSION_TTL_MS, isSessionExpired } from "./visitorCounter";

test("seed is 1204 (first registered visitor is 1205)", () => {
  assert.equal(VISITOR_SEED, 1204);
});

test("parseVisitorRow maps a well-formed row", () => {
  const rec = parseVisitorRow({ id: "abc", number: 1205 });
  assert.deepEqual(rec, { id: "abc", number: 1205 });
});

test("parseVisitorRow coerces a Postgres bigint string to a number", () => {
  // Postgres bigint comes back over the wire as a string (e.g. "1300").
  const rec = parseVisitorRow({ id: "abc", number: "1300" });
  assert.deepEqual(rec, { id: "abc", number: 1300 });
});

test("parseVisitorRow returns null for null / non-object", () => {
  assert.equal(parseVisitorRow(null), null);
  assert.equal(parseVisitorRow(undefined), null);
  assert.equal(parseVisitorRow("nope"), null);
});

test("parseVisitorRow returns null when id is missing or not a string", () => {
  assert.equal(parseVisitorRow({ number: 1205 }), null);
  assert.equal(parseVisitorRow({ id: 42, number: 1205 }), null);
});

test("parseVisitorRow returns null when number is missing or non-numeric", () => {
  assert.equal(parseVisitorRow({ id: "abc" }), null);
  assert.equal(parseVisitorRow({ id: "abc", number: "not-a-number" }), null);
});

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
  assert.equal(isSessionExpired(0, 1_000_000_000), true); // epoch => force-expired
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
