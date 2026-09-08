import assert from "node:assert/strict";
import { test } from "node:test";

import { chunk } from "./chunk.ts";

test("splits into even chunks", () => {
  assert.deepEqual(chunk([1, 2, 3, 4], 2), [
    [1, 2],
    [3, 4],
  ]);
});

test("keeps a trailing partial chunk", () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
});

test("returns [] for an empty array", () => {
  assert.deepEqual(chunk([], 3), []);
});

test("returns a single chunk when size >= length", () => {
  assert.deepEqual(chunk([1, 2], 5), [[1, 2]]);
});

test("throws on a non-positive size", () => {
  assert.throws(() => chunk([1, 2], 0), /size must be greater than 0/);
});
