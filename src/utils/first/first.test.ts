import assert from "node:assert/strict";
import { test } from "node:test";

import { first } from "./first.ts";

test("returns the first element", () => {
  assert.equal(first([1, 2, 3]), 1);
});

test("returns undefined for an empty array", () => {
  assert.equal(first([]), undefined);
});

test("returns the first n elements when n is given", () => {
  assert.deepEqual(first([1, 2, 3], 2), [1, 2]);
});

test("clamps n to the array length", () => {
  assert.deepEqual(first([1, 2], 5), [1, 2]);
});

test("returns [] for n <= 0", () => {
  assert.deepEqual(first([1, 2, 3], 0), []);
});
