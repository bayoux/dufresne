import assert from "node:assert/strict";
import { test } from "node:test";

import { compose } from "./compose.ts";

test("runs functions right to left", () => {
  const shout = compose(
    (s: string) => `${s}!`,
    (s: string) => s.toUpperCase(),
  );
  assert.equal(shout("hi"), "HI!");
});

test("passes every argument to the rightmost function only", () => {
  const sumThenDouble = compose((n: number) => n * 2, (a: number, b: number) => a + b);
  assert.equal(sumThenDouble(2, 3), 10);
});

test("returns the first argument unchanged when called with no functions", () => {
  assert.equal(compose()(42), 42);
});
