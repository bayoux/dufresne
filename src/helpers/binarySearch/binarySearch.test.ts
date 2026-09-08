import assert from "node:assert/strict";
import { test } from "node:test";

import { binarySearch } from "./binarySearch.ts";

test("finds a present value", () => {
  assert.equal(binarySearch([1, 3, 5, 7, 9], 7), 3);
  assert.equal(binarySearch([1, 3, 5, 7, 9], 1), 0);
  assert.equal(binarySearch([1, 3, 5, 7, 9], 9), 4);
});

test("returns -1 for an absent value", () => {
  assert.equal(binarySearch([1, 3, 5, 7, 9], 4), -1);
});

test("returns -1 for an empty array", () => {
  assert.equal(binarySearch([], 1), -1);
});

test("accepts a custom comparator", () => {
  const words = ["banana", "cherry", "apple"].sort((a, b) => b.localeCompare(a));
  const index = binarySearch(words, "cherry", (a, b) => b.localeCompare(a));
  assert.equal(words[index], "cherry");
});
