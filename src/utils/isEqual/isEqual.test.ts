import assert from "node:assert/strict";
import { test } from "node:test";

import { isEqual } from "./isEqual.ts";

test("compares primitives", () => {
  assert.equal(isEqual(1, 1), true);
  assert.equal(isEqual(1, 2), false);
  assert.equal(isEqual(NaN, NaN), true);
  assert.equal(isEqual(0, -0), false);
});

test("deep-compares arrays", () => {
  assert.equal(isEqual([1, [2, 3]], [1, [2, 3]]), true);
  assert.equal(isEqual([1, 2], [1, 2, 3]), false);
});

test("deep-compares plain objects regardless of key order", () => {
  assert.equal(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 }), true);
  assert.equal(isEqual({ a: 1 }, { a: 1, b: 2 }), false);
});

test("compares dates by their time value", () => {
  assert.equal(isEqual(new Date(2020, 0, 1), new Date(2020, 0, 1)), true);
  assert.equal(isEqual(new Date(2020, 0, 1), new Date(2020, 0, 2)), false);
});

test("an array is never equal to a plain object", () => {
  assert.equal(isEqual([1, 2], { 0: 1, 1: 2 }), false);
});

test("handles nested structures", () => {
  assert.equal(isEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }), true);
  assert.equal(isEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 3 }] }), false);
});
