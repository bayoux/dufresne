import assert from "node:assert/strict";
import { test } from "node:test";

import { pull } from "./pull.ts";

test("removes all listed values", () => {
  assert.deepEqual(pull([1, 2, 3, 1, 2, 3], 2, 3), [1, 1]);
});

test("returns a copy when nothing matches", () => {
  const input = [1, 2, 3];
  const result = pull(input, 4, 5);
  assert.deepEqual(result, [1, 2, 3]);
  assert.notEqual(result, input);
});

test("returns a copy when no values are passed", () => {
  assert.deepEqual(pull([1, 2, 3]), [1, 2, 3]);
});

test("works with strings", () => {
  assert.deepEqual(pull(["a", "b", "c", "b"], "b"), ["a", "c"]);
});
