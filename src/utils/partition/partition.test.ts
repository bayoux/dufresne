import assert from "node:assert/strict";
import { test } from "node:test";

import { partition } from "./partition.ts";

test("splits into [pass, fail]", () => {
  assert.deepEqual(
    partition([1, 2, 3, 4, 5], (n) => n % 2 === 0),
    [
      [2, 4],
      [1, 3, 5],
    ],
  );
});

test("returns [[], []] for an empty array", () => {
  assert.deepEqual(
    partition([] as number[], (n) => n > 0),
    [[], []],
  );
});

test("handles every item failing", () => {
  assert.deepEqual(
    partition([1, 2, 3], () => false),
    [[], [1, 2, 3]],
  );
});
