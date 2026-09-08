import assert from "node:assert/strict";
import { test } from "node:test";

import { range } from "./range.ts";

test("builds 0..stop with a single argument", () => {
  assert.deepEqual(range(5), [0, 1, 2, 3, 4]);
});

test("builds start..stop with two arguments", () => {
  assert.deepEqual(range(2, 6), [2, 3, 4, 5]);
});

test("respects a custom step", () => {
  assert.deepEqual(range(2, 10, 2), [2, 4, 6, 8]);
});

test("supports a negative step to count down", () => {
  assert.deepEqual(range(5, 0, -1), [5, 4, 3, 2, 1]);
});

test("returns [] when start already meets stop", () => {
  assert.deepEqual(range(3, 3), []);
});

test("throws for a step of 0", () => {
  assert.throws(() => range(0, 5, 0), /step must not be 0/);
});
