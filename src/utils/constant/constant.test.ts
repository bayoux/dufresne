import assert from "node:assert/strict";
import { test } from "node:test";

import { constant } from "./constant.ts";

test("always returns the same value", () => {
  const alwaysFive = constant(5);
  assert.equal(alwaysFive(), 5);
  assert.equal(alwaysFive(), 5);
});

test("ignores whatever it's mapped over", () => {
  assert.deepEqual([1, 2, 3].map(constant(0)), [0, 0, 0]);
});
