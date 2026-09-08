import assert from "node:assert/strict";
import { test } from "node:test";

import { last } from "./last.ts";

test("returns the last element", () => {
  assert.equal(last([1, 2, 3]), 3);
});

test("returns undefined for an empty array", () => {
  assert.equal(last([]), undefined);
});

test("returns the last n elements when n is given", () => {
  assert.deepEqual(last([1, 2, 3], 2), [2, 3]);
});

test("clamps n to the array length", () => {
  assert.deepEqual(last([1, 2], 5), [1, 2]);
});

test("returns [] for n <= 0", () => {
  assert.deepEqual(last([1, 2, 3], 0), []);
});
