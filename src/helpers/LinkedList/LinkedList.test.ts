import assert from "node:assert/strict";
import { test } from "node:test";

import { LinkedList } from "./LinkedList.ts";

test("pushes to the tail and shifts from the head", () => {
  const list = new LinkedList<number>();
  list.push(1);
  list.push(2);
  list.push(3);
  assert.deepEqual(list.toArray(), [1, 2, 3]);
  assert.equal(list.shift(), 1);
  assert.deepEqual(list.toArray(), [2, 3]);
});

test("tracks size and isEmpty", () => {
  const list = new LinkedList<number>();
  assert.equal(list.isEmpty, true);
  list.push(1);
  assert.equal(list.size, 1);
  list.shift();
  assert.equal(list.isEmpty, true);
});

test("shift on an empty list returns undefined", () => {
  const list = new LinkedList<number>();
  assert.equal(list.shift(), undefined);
});

test("stays consistent after emptying and refilling", () => {
  const list = new LinkedList<number>();
  list.push(1);
  list.shift();
  list.push(2);
  list.push(3);
  assert.deepEqual(list.toArray(), [2, 3]);
});
