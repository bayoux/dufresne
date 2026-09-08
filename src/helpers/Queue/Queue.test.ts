import assert from "node:assert/strict";
import { test } from "node:test";

import { Queue } from "./Queue.ts";

test("dequeues in FIFO order", () => {
  const q = new Queue<number>();
  q.enqueue(1);
  q.enqueue(2);
  q.enqueue(3);
  assert.equal(q.dequeue(), 1);
  assert.equal(q.dequeue(), 2);
  assert.equal(q.dequeue(), 3);
  assert.equal(q.dequeue(), undefined);
});

test("peek does not remove the item", () => {
  const q = new Queue<string>();
  q.enqueue("a");
  assert.equal(q.peek(), "a");
  assert.equal(q.size, 1);
});

test("tracks size and isEmpty", () => {
  const q = new Queue<number>();
  assert.equal(q.isEmpty, true);
  q.enqueue(1);
  assert.equal(q.isEmpty, false);
  assert.equal(q.size, 1);
});

test("toArray snapshots the current contents, front to back", () => {
  const q = new Queue<number>();
  q.enqueue(1);
  q.enqueue(2);
  assert.deepEqual(q.toArray(), [1, 2]);
});
