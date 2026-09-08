import assert from "node:assert/strict";
import { test } from "node:test";

import { quickSort } from "./quickSort.ts";

test("sorts ascending by default", () => {
  assert.deepEqual(quickSort([5, 3, 8, 1, 9, 2]), [1, 2, 3, 5, 8, 9]);
});

test("does not mutate the input", () => {
  const input = [3, 1, 2];
  quickSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test("handles [], single-element and already-sorted arrays", () => {
  assert.deepEqual(quickSort([]), []);
  assert.deepEqual(quickSort([1]), [1]);
  assert.deepEqual(quickSort([1, 2, 3]), [1, 2, 3]);
});

test("handles duplicate values", () => {
  assert.deepEqual(quickSort([2, 1, 2, 1, 3]), [1, 1, 2, 2, 3]);
});

test("accepts a custom comparator", () => {
  assert.deepEqual(
    quickSort([1, 3, 2], (a, b) => b - a),
    [3, 2, 1],
  );
});
