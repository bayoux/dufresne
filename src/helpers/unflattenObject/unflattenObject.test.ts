import assert from "node:assert/strict";
import { test } from "node:test";

import { unflattenObject } from "./unflattenObject.ts";

test("rebuilds nested objects from dot-notation keys", () => {
  assert.deepEqual(unflattenObject({ "a.b": 1, "a.c.d": 2 }), { a: { b: 1, c: { d: 2 } } });
});

test("leaves already-flat keys unchanged", () => {
  assert.deepEqual(unflattenObject({ a: 1, b: 2 }), { a: 1, b: 2 });
});

test("returns {} for an empty object", () => {
  assert.deepEqual(unflattenObject({}), {});
});

test("round-trips with flattenObject's output", () => {
  const nested = { a: { b: 1, c: { d: 2 } } };
  const flat = { "a.b": 1, "a.c.d": 2 };
  assert.deepEqual(unflattenObject(flat), nested);
});
