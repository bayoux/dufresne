import assert from "node:assert/strict";
import { test } from "node:test";

import { deepMerge } from "./deepMerge.ts";

interface Nested {
  a: { x?: number; y?: number };
}

interface Flat {
  a?: number;
  b?: number;
  c?: number;
}

test("merges nested objects recursively", () => {
  const base: Nested = { a: { x: 1 } };
  const patch: Nested = { a: { y: 2 } };
  assert.deepEqual(deepMerge(base, patch), { a: { x: 1, y: 2 } });
});

test("later sources win on a plain-value conflict", () => {
  assert.deepEqual(deepMerge({ a: 1 }, { a: 2 }), { a: 2 });
});

test("replaces arrays outright instead of merging them", () => {
  assert.deepEqual(deepMerge({ a: [1, 2] }, { a: [3] }), { a: [3] });
});

test("merges more than two sources, left to right", () => {
  const result = deepMerge<Flat>({ a: 1 }, { b: 2 }, { a: 3, c: 4 });
  assert.deepEqual(result, { a: 3, b: 2, c: 4 });
});

test("does not mutate any of its inputs", () => {
  const base: Nested = { a: { x: 1 } };
  const patch: Nested = { a: { y: 2 } };
  deepMerge(base, patch);
  assert.deepEqual(base, { a: { x: 1 } });
  assert.deepEqual(patch, { a: { y: 2 } });
});
