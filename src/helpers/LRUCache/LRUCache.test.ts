import assert from "node:assert/strict";
import { test } from "node:test";

import { LRUCache } from "./LRUCache.ts";

test("evicts the least-recently-used entry once full", () => {
  const cache = new LRUCache<string, number>(2);
  cache.set("a", 1);
  cache.set("b", 2);
  cache.set("c", 3);

  assert.equal(cache.has("a"), false);
  assert.equal(cache.get("b"), 2);
  assert.equal(cache.get("c"), 3);
});

test("get refreshes an entry's recency", () => {
  const cache = new LRUCache<string, number>(2);
  cache.set("a", 1);
  cache.set("b", 2);
  cache.get("a"); // "a" is now more recent than "b"
  cache.set("c", 3); // should evict "b", not "a"

  assert.equal(cache.has("a"), true);
  assert.equal(cache.has("b"), false);
});

test("overwriting an existing key does not evict anything", () => {
  const cache = new LRUCache<string, number>(2);
  cache.set("a", 1);
  cache.set("b", 2);
  cache.set("a", 10);

  assert.equal(cache.size, 2);
  assert.equal(cache.get("a"), 10);
});

test("throws for a non-positive capacity", () => {
  assert.throws(() => new LRUCache(0), /capacity must be > 0/);
});
