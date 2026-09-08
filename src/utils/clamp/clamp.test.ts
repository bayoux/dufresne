import assert from "node:assert/strict";
import { test } from "node:test";

import { clamp } from "./clamp.ts";

test("returns the value when it's within range", () => {
  assert.equal(clamp(5, 0, 10), 5);
});

test("clamps to the max", () => {
  assert.equal(clamp(15, 0, 10), 10);
});

test("clamps to the min", () => {
  assert.equal(clamp(-5, 0, 10), 0);
});

test("throws when min > max", () => {
  assert.throws(() => clamp(1, 10, 0), /min must be <= max/);
});
