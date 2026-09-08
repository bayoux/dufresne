import assert from "node:assert/strict";
import { test } from "node:test";

import { applyCase, toCamel, toKebab } from "./cases.ts";

test("toKebab splits camelCase and normalizes separators", () => {
  assert.equal(toKebab("deepMerge"), "deep-merge");
  assert.equal(toKebab("intersection"), "intersection");
  assert.equal(toKebab("is_URL"), "is-url");
  assert.equal(toKebab("group by"), "group-by");
});

test("toKebab splits an acronym from the word that follows it", () => {
  assert.equal(toKebab("LRUCache"), "lru-cache");
  assert.equal(toKebab("XMLHttpRequest"), "xml-http-request");
});

test("toCamel collapses separators", () => {
  assert.equal(toCamel("deep-merge"), "deepMerge");
  assert.equal(toCamel("group_by"), "groupBy");
  assert.equal(toCamel("intersection"), "intersection");
});

test("applyCase dispatches on style", () => {
  assert.equal(applyCase("deepMerge", "kebab"), "deep-merge");
  assert.equal(applyCase("deep-merge", "camel"), "deepMerge");
});
