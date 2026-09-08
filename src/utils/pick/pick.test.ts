import assert from "node:assert/strict";
import { test } from "node:test";

import { pick } from "./pick.ts";

test("keeps only the given keys", () => {
  assert.deepEqual(pick({ a: 1, b: 2, c: 3 }, "a", "c"), { a: 1, c: 3 });
});

test("ignores keys the object doesn't have", () => {
  assert.deepEqual(pick({ a: 1 } as { a: number; b?: number }, "a", "b"), { a: 1 });
});

test("returns {} when no keys are given", () => {
  assert.deepEqual(pick({ a: 1, b: 2 }), {});
});
