import assert from "node:assert/strict";
import { test } from "node:test";

import { mergeSort } from "./mergeSort.ts";

test("sorts ascending by default", () => {
  assert.deepEqual(mergeSort([5, 3, 8, 1, 9, 2]), [1, 2, 3, 5, 8, 9]);
});

test("does not mutate the input", () => {
  const input = [3, 1, 2];
  mergeSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test("is stable: equal elements keep their relative order", () => {
  const input = [
    { key: 1, tag: "a" },
    { key: 0, tag: "b" },
    { key: 1, tag: "c" },
  ];
  const sorted = mergeSort(input, (a, b) => a.key - b.key);
  assert.deepEqual(
    sorted.map((x) => x.tag),
    ["b", "a", "c"],
  );
});

test("handles [] and single-element arrays", () => {
  assert.deepEqual(mergeSort([]), []);
  assert.deepEqual(mergeSort([1]), [1]);
});
