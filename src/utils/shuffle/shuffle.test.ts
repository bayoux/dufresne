import assert from "node:assert/strict";
import { test } from "node:test";

import { shuffle } from "./shuffle.ts";

test("returns an array with the same elements", () => {
  const input = [1, 2, 3, 4, 5];
  const result = shuffle(input);
  assert.deepEqual([...result].sort(), [...input].sort());
  assert.equal(result.length, input.length);
});

test("does not mutate the input array", () => {
  const input = [1, 2, 3];
  shuffle(input);
  assert.deepEqual(input, [1, 2, 3]);
});

test("follows Fisher-Yates exactly for a fixed Math.random", (t) => {
  t.mock.method(Math, "random", () => 0);
  assert.deepEqual(shuffle([1, 2, 3, 4]), [2, 3, 4, 1]);
});
