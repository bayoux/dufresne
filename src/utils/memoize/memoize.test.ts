import assert from "node:assert/strict";
import { test } from "node:test";

import { memoize } from "./memoize.ts";

test("computes once per distinct key", () => {
  let calls = 0;
  const square = memoize((n: number) => {
    calls++;
    return n * n;
  });

  assert.equal(square(4), 16);
  assert.equal(square(4), 16);
  assert.equal(calls, 1);

  assert.equal(square(5), 25);
  assert.equal(calls, 2);
});

test("keys by a custom resolver when given", () => {
  let calls = 0;
  const fn = memoize(
    (a: number, b: number) => {
      calls++;
      return a + b;
    },
    (a, b) => `${a}:${b}`,
  );

  fn(1, 2);
  fn(1, 2);
  fn(2, 1);

  assert.equal(calls, 2);
});

test("exposes the underlying cache", () => {
  const fn = memoize((n: number) => n);
  fn(1);
  assert.equal(fn.cache.get(1), 1);
});
