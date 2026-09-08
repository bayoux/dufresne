import assert from "node:assert/strict";
import { test } from "node:test";

import { fibonacci } from "./fibonacci.ts";

test("computes the classic sequence", () => {
  assert.deepEqual(
    Array.from({ length: 10 }, (_, i) => fibonacci(i)),
    [0, 1, 1, 2, 3, 5, 8, 13, 21, 34],
  );
});

test("handles a larger n via memoization without stack overflow", () => {
  assert.equal(fibonacci(50), 12586269025);
});

test("throws for a negative or non-integer n", () => {
  assert.throws(() => fibonacci(-1), /non-negative integer/);
  assert.throws(() => fibonacci(1.5), /non-negative integer/);
});
