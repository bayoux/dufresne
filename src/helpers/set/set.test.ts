import assert from "node:assert/strict";
import { test } from "node:test";

import { set } from "./set.ts";

test("creates intermediate objects as needed", () => {
  assert.deepEqual(set({}, "a.b.c", 1), { a: { b: { c: 1 } } });
});

test("overwrites an existing value at the path", () => {
  assert.deepEqual(set({ a: { b: 1 } }, "a.b", 2), { a: { b: 2 } });
});

test("replaces a non-object in the way of the path", () => {
  assert.deepEqual(set({ a: 1 }, "a.b", 2), { a: { b: 2 } });
});

test("mutates and returns the same object", () => {
  const obj = {};
  const result = set(obj, "a", 1);
  assert.equal(result, obj);
});

test("supports bracket-notation array indices", () => {
  const result = set<{ a?: { b?: unknown[] } }>({}, "a.b[1]", "x");
  assert.deepEqual(result, { a: { b: { 1: "x" } } });
});
