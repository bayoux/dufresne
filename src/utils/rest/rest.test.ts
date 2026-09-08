import assert from "node:assert/strict";
import { test } from "node:test";

import { rest } from "./rest.ts";

test("drops the first element by default", () => {
  assert.deepEqual(rest([1, 2, 3]), [2, 3]);
});

test("drops the first n elements", () => {
  assert.deepEqual(rest([1, 2, 3], 2), [3]);
});

test("returns [] when n covers the whole array", () => {
  assert.deepEqual(rest([1, 2, 3], 5), []);
});

test("returns [] for an empty array", () => {
  assert.deepEqual(rest([]), []);
});
