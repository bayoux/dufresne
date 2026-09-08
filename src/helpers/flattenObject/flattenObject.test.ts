import assert from "node:assert/strict";
import { test } from "node:test";

import { flattenObject } from "./flattenObject.ts";

test("joins nested keys with a dot", () => {
  assert.deepEqual(flattenObject({ a: { b: 1, c: { d: 2 } } }), { "a.b": 1, "a.c.d": 2 });
});

test("keeps arrays as leaf values", () => {
  assert.deepEqual(flattenObject({ a: [1, 2] }), { a: [1, 2] });
});

test("leaves an already-flat object unchanged", () => {
  assert.deepEqual(flattenObject({ a: 1, b: 2 }), { a: 1, b: 2 });
});

test("returns {} for an empty object", () => {
  assert.deepEqual(flattenObject({}), {});
});
