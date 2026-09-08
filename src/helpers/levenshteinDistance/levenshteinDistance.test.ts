import assert from "node:assert/strict";
import { test } from "node:test";

import { levenshteinDistance } from "./levenshteinDistance.ts";

test("counts single-character edits", () => {
  assert.equal(levenshteinDistance("kitten", "sitting"), 3);
  assert.equal(levenshteinDistance("clam", "clamp"), 1);
});

test("returns 0 for identical strings", () => {
  assert.equal(levenshteinDistance("same", "same"), 0);
});

test("returns the other string's length when one side is empty", () => {
  assert.equal(levenshteinDistance("", "abc"), 3);
  assert.equal(levenshteinDistance("abc", ""), 3);
});

test("is symmetric", () => {
  assert.equal(levenshteinDistance("abc", "yz"), levenshteinDistance("yz", "abc"));
});
