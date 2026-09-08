import assert from "node:assert/strict";
import { test } from "node:test";

import { once } from "./once.ts";

test("calls the wrapped function only once", () => {
  let calls = 0;
  const fn = once(() => ++calls);

  fn();
  fn();
  fn();

  assert.equal(calls, 1);
});

test("returns the first call's result on every subsequent call", () => {
  let n = 0;
  const fn = once(() => ++n);

  assert.equal(fn(), 1);
  assert.equal(fn(), 1);
});

test("passes through the arguments of the first call", () => {
  const fn = once((a: number, b: number) => a + b);
  assert.equal(fn(2, 3), 5);
  assert.equal(fn(10, 10), 5);
});
