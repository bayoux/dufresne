import assert from "node:assert/strict";
import { test } from "node:test";

import { difference } from "./difference.ts";

test("removes values found in any other array", () => {
  assert.deepEqual(difference([1, 2, 3, 4], [2, 4]), [1, 3]);
});

test("accepts multiple exclusion arrays", () => {
  assert.deepEqual(difference([1, 2, 3, 4], [2], [4]), [1, 3]);
});

test("returns a copy when nothing is excluded", () => {
  assert.deepEqual(difference([1, 2], [3, 4]), [1, 2]);
});

test("returns [] for an empty source array", () => {
  assert.deepEqual(difference([], [1, 2]), []);
});
