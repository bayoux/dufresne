import assert from "node:assert/strict";
import { test } from "node:test";

import { negate } from "./negate.ts";

test("inverts a predicate's result", () => {
  const isEven = (n: number) => n % 2 === 0;
  const isOdd = negate(isEven);

  assert.equal(isOdd(3), true);
  assert.equal(isOdd(4), false);
});

test("passes every argument through", () => {
  const bothTruthy = negate((a: unknown, b: unknown) => !a || !b);
  assert.equal(bothTruthy(1, 1), true);
  assert.equal(bothTruthy(0, 1), false);
});
