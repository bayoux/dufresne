import assert from "node:assert/strict";
import { test } from "node:test";

import { Trie } from "./Trie.ts";

test("finds exact words that were inserted", () => {
  const trie = new Trie();
  trie.insert("cat");
  trie.insert("car");

  assert.equal(trie.has("cat"), true);
  assert.equal(trie.has("car"), true);
  assert.equal(trie.has("ca"), false);
  assert.equal(trie.has("dog"), false);
});

test("startsWith matches any inserted prefix, complete word or not", () => {
  const trie = new Trie();
  trie.insert("cat");

  assert.equal(trie.startsWith("c"), true);
  assert.equal(trie.startsWith("ca"), true);
  assert.equal(trie.startsWith("cat"), true);
  assert.equal(trie.startsWith("cats"), false);
});

test("an empty trie matches nothing", () => {
  const trie = new Trie();
  assert.equal(trie.has("anything"), false);
  assert.equal(trie.startsWith(""), true);
});
