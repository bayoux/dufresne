import assert from "node:assert/strict";
import { test } from "node:test";

import { gcd } from "./gcd.ts";

test("computes the greatest common divisor", () => {
  assert.equal(gcd(12, 18), 6);
  assert.equal(gcd(17, 5), 1);
});

test("returns the non-zero value when the other is 0", () => {
  assert.equal(gcd(0, 5), 5);
  assert.equal(gcd(5, 0), 5);
});

test("ignores sign", () => {
  assert.equal(gcd(-12, 18), 6);
});
