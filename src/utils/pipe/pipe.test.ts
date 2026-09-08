import assert from "node:assert/strict";
import { test } from "node:test";

import { pipe } from "./pipe.ts";

test("runs functions left to right", () => {
  const shout = pipe(
    (s: string) => s.toUpperCase(),
    (s: string) => `${s}!`,
  );
  assert.equal(shout("hi"), "HI!");
});

test("passes every argument to the leftmost function only", () => {
  const sumThenDouble = pipe(
    (a: number, b: number) => a + b,
    (n: number) => n * 2,
  );
  assert.equal(sumThenDouble(2, 3), 10);
});

test("returns the first argument unchanged when called with no functions", () => {
  assert.equal(pipe()(42), 42);
});

test("order matters: reversing the functions changes the result", () => {
  const trim = (s: string) => s.trim();
  const upper = (s: string) => s.toUpperCase();

  assert.equal(pipe(trim, upper)("  hi  "), "HI");
  assert.equal(pipe(upper, trim)("  hi  "), "HI");
  // both look the same here since neither op is destructive to the other's
  // input shape — flip to something order-sensitive to see the difference:
  const wrap = (s: string) => `[${s}]`;
  assert.equal(pipe(trim, wrap)("  hi  "), "[hi]");
  assert.equal(pipe(wrap, trim)("  hi  "), "[  hi  ]");
});
