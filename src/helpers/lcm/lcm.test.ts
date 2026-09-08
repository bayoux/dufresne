import assert from "node:assert/strict";
import { test } from "node:test";

import { lcm } from "./lcm.ts";

test("computes the least common multiple", () => {
  assert.equal(lcm(4, 6), 12);
  assert.equal(lcm(3, 5), 15);
});

test("returns 0 when either input is 0", () => {
  assert.equal(lcm(0, 5), 0);
  assert.equal(lcm(5, 0), 0);
});

test("handles equal values", () => {
  assert.equal(lcm(7, 7), 7);
});
