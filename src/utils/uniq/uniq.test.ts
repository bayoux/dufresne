import assert from "node:assert/strict";
import { test } from "node:test";

import { uniq } from "./uniq.ts";

test("drops later duplicates, keeping first-seen order", () => {
  assert.deepEqual(uniq([1, 2, 2, 3, 1]), [1, 2, 3]);
});

test("dedupes by a derived key when given", () => {
  const result = uniq([1.1, 1.9, 2.2], (n) => Math.floor(n));
  assert.deepEqual(result, [1.1, 2.2]);
});

test("returns [] for an empty array", () => {
  assert.deepEqual(uniq([]), []);
});
