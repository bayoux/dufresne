import assert from "node:assert/strict";
import { test } from "node:test";

import { intersection } from "./intersection.ts";

test("returns [] for no arguments", () => {
  assert.deepEqual(intersection(), []);
});

test("returns the single array unchanged", () => {
  assert.deepEqual(intersection([1, 2, 3]), [1, 2, 3]);
});

test("keeps only values present in every array", () => {
  assert.deepEqual(intersection([1, 2, 3, 4], [2, 3, 5], [0, 2, 3]), [2, 3]);
});

test("preserves the order of the first array", () => {
  assert.deepEqual(intersection([3, 1, 2], [1, 2, 3]), [3, 1, 2]);
});

test("returns [] when there is no common value", () => {
  assert.deepEqual(intersection([1, 2], [3, 4]), []);
});

test("works with strings", () => {
  assert.deepEqual(intersection(["a", "b", "c"], ["b", "c", "d"]), ["b", "c"]);
});
