import assert from "node:assert/strict";
import { test } from "node:test";

import { omit } from "./omit.ts";

test("drops the given keys", () => {
  assert.deepEqual(omit({ a: 1, b: 2, c: 3 }, "b"), { a: 1, c: 3 });
});

test("returns a copy when no keys are given", () => {
  const input = { a: 1, b: 2 };
  const result = omit(input);
  assert.deepEqual(result, input);
  assert.notEqual(result, input);
});

test("does not mutate the source object", () => {
  const input = { a: 1, b: 2 };
  omit(input, "b");
  assert.deepEqual(input, { a: 1, b: 2 });
});
