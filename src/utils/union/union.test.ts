import assert from "node:assert/strict";
import { test } from "node:test";

import { union } from "./union.ts";

test("merges arrays and drops duplicates", () => {
  assert.deepEqual(union([1, 2], [2, 3], [3, 4]), [1, 2, 3, 4]);
});

test("returns [] when called with no arrays", () => {
  assert.deepEqual(union(), []);
});

test("returns a copy of the single array unchanged", () => {
  assert.deepEqual(union([1, 2, 3]), [1, 2, 3]);
});
