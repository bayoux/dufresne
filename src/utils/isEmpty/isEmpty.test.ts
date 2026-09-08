import assert from "node:assert/strict";
import { test } from "node:test";

import { isEmpty } from "./isEmpty.ts";

test("treats null and undefined as empty", () => {
  assert.equal(isEmpty(null), true);
  assert.equal(isEmpty(undefined), true);
});

test("checks array/string length", () => {
  assert.equal(isEmpty([]), true);
  assert.equal(isEmpty([1]), false);
  assert.equal(isEmpty(""), true);
  assert.equal(isEmpty("a"), false);
});

test("checks Map/Set size", () => {
  assert.equal(isEmpty(new Map()), true);
  assert.equal(isEmpty(new Map([["a", 1]])), false);
  assert.equal(isEmpty(new Set()), true);
});

test("checks own keys for plain objects", () => {
  assert.equal(isEmpty({}), true);
  assert.equal(isEmpty({ a: 1 }), false);
});

test("numbers and booleans are never empty", () => {
  assert.equal(isEmpty(0), false);
  assert.equal(isEmpty(false), false);
});
