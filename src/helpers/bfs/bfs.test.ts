import assert from "node:assert/strict";
import { test } from "node:test";

import { bfs } from "./bfs.ts";

test("visits nodes level by level", () => {
  const graph = new Map([
    ["a", ["b", "c"]],
    ["b", ["d"]],
    ["c", ["d"]],
    ["d", []],
  ]);
  assert.deepEqual(bfs(graph, "a"), ["a", "b", "c", "d"]);
});

test("does not revisit a node reachable through multiple paths", () => {
  const graph = new Map([
    ["a", ["b", "c"]],
    ["b", ["c"]],
    ["c", []],
  ]);
  assert.deepEqual(bfs(graph, "a"), ["a", "b", "c"]);
});

test("a node with no edges visits only itself", () => {
  const graph = new Map([["a", []]]);
  assert.deepEqual(bfs(graph, "a"), ["a"]);
});

test("tolerates a start node missing from the graph", () => {
  const graph = new Map<string, string[]>();
  assert.deepEqual(bfs(graph, "a"), ["a"]);
});
