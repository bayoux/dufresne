import assert from "node:assert/strict";
import { test } from "node:test";

import { dfs } from "./dfs.ts";

test("visits depth-first, following the first edge all the way down", () => {
  const graph = new Map([
    ["a", ["b", "c"]],
    ["b", ["d"]],
    ["c", []],
    ["d", []],
  ]);
  assert.deepEqual(dfs(graph, "a"), ["a", "b", "d", "c"]);
});

test("does not revisit a node reachable through multiple paths", () => {
  const graph = new Map([
    ["a", ["b", "c"]],
    ["b", ["c"]],
    ["c", []],
  ]);
  assert.deepEqual(dfs(graph, "a"), ["a", "b", "c"]);
});

test("handles a cycle without looping forever", () => {
  const graph = new Map([
    ["a", ["b"]],
    ["b", ["a"]],
  ]);
  assert.deepEqual(dfs(graph, "a"), ["a", "b"]);
});
