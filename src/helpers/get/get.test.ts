import assert from "node:assert/strict";
import { test } from "node:test";

import { get } from "./get.ts";

test("reads a nested property via dot notation", () => {
  assert.equal(get({ a: { b: { c: 1 } } }, "a.b.c"), 1);
});

test("reads through array indices in bracket notation", () => {
  assert.equal(get({ a: { b: [1, 2, 3] } }, "a.b[1]"), 2);
});

test("returns the fallback when a step is missing", () => {
  assert.equal(get({ a: {} }, "a.b.c", "default"), "default");
  assert.equal(get({}, "x.y", "default"), "default");
});

test("returns undefined with no fallback when the path is missing", () => {
  assert.equal(get({}, "x.y"), undefined);
});

test("returns the fallback when traversing through a non-object", () => {
  assert.equal(get({ a: 1 }, "a.b", "default"), "default");
});

test("returns the root value for an empty path", () => {
  const obj = { a: 1 };
  assert.deepEqual(get(obj, ""), obj);
});
