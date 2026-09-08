import assert from "node:assert/strict";
import { test } from "node:test";

import { times } from "./times.ts";

test("collects the result of n calls", () => {
  assert.deepEqual(times(3, (i) => i * 2), [0, 2, 4]);
});

test("returns [] for n <= 0", () => {
  assert.deepEqual(times(0, (i) => i), []);
  assert.deepEqual(times(-1, (i) => i), []);
});

test("calls fn exactly n times", () => {
  let calls = 0;
  times(5, () => calls++);
  assert.equal(calls, 5);
});
