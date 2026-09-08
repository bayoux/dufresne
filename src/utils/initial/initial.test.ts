import assert from "node:assert/strict";
import { test } from "node:test";

import { initial } from "./initial.ts";

test("drops the last element by default", () => {
  assert.deepEqual(initial([1, 2, 3]), [1, 2]);
});

test("drops the last n elements", () => {
  assert.deepEqual(initial([1, 2, 3], 2), [1]);
});

test("returns [] when n covers the whole array", () => {
  assert.deepEqual(initial([1, 2, 3], 5), []);
});

test("returns [] for an empty array", () => {
  assert.deepEqual(initial([]), []);
});
