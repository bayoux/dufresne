import assert from "node:assert/strict";
import { test } from "node:test";

import { Stack } from "./Stack.ts";

test("pops in LIFO order", () => {
  const s = new Stack<number>();
  s.push(1);
  s.push(2);
  s.push(3);
  assert.equal(s.pop(), 3);
  assert.equal(s.pop(), 2);
  assert.equal(s.pop(), 1);
  assert.equal(s.pop(), undefined);
});

test("peek does not remove the item", () => {
  const s = new Stack<string>();
  s.push("a");
  assert.equal(s.peek(), "a");
  assert.equal(s.size, 1);
});

test("tracks size and isEmpty", () => {
  const s = new Stack<number>();
  assert.equal(s.isEmpty, true);
  s.push(1);
  assert.equal(s.isEmpty, false);
  assert.equal(s.size, 1);
});

test("toArray snapshots the current contents, bottom to top", () => {
  const s = new Stack<number>();
  s.push(1);
  s.push(2);
  assert.deepEqual(s.toArray(), [1, 2]);
});
