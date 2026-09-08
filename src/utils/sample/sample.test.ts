import assert from "node:assert/strict";
import { test } from "node:test";

import { sample } from "./sample.ts";

test("returns undefined for an empty array", () => {
  assert.equal(sample([]), undefined);
});

test("returns one element that belongs to the array", () => {
  const input = [1, 2, 3];
  assert.ok(input.includes(sample(input) as number));
});

test("returns n distinct elements, all from the source", (t) => {
  t.mock.method(Math, "random", () => 0);
  const result = sample([1, 2, 3, 4], 2);
  assert.equal(result.length, 2);
  assert.equal(new Set(result).size, 2);
  for (const item of result) assert.ok([1, 2, 3, 4].includes(item));
});

test("clamps n to the array length", () => {
  assert.equal(sample([1, 2], 5).length, 2);
});
