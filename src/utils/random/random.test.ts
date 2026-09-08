import assert from "node:assert/strict";
import { test } from "node:test";

import { random } from "./random.ts";

test("stays within [0, max] with one argument", () => {
  for (let i = 0; i < 50; i++) {
    const n = random(3);
    assert.ok(n >= 0 && n <= 3);
    assert.equal(Number.isInteger(n), true);
  }
});

test("stays within [min, max] with two arguments", () => {
  for (let i = 0; i < 50; i++) {
    const n = random(5, 10);
    assert.ok(n >= 5 && n <= 10);
  }
});

test("returns the only possible value when min equals max", () => {
  assert.equal(random(7, 7), 7);
});

test("is exactly the bound when Math.random returns 0", (t) => {
  t.mock.method(Math, "random", () => 0);
  assert.equal(random(5, 10), 5);
});
