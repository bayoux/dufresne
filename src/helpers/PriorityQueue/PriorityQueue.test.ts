import assert from "node:assert/strict";
import { test } from "node:test";

import { PriorityQueue } from "./PriorityQueue.ts";

test("pops the lowest priority first", () => {
  const pq = new PriorityQueue<string>();
  pq.push("low", 5);
  pq.push("high", 1);
  pq.push("mid", 3);

  assert.equal(pq.pop(), "high");
  assert.equal(pq.pop(), "mid");
  assert.equal(pq.pop(), "low");
  assert.equal(pq.pop(), undefined);
});

test("handles ties and out-of-order insertion", () => {
  const pq = new PriorityQueue<number>();
  for (const [value, priority] of [
    [5, 2],
    [1, 0],
    [4, 2],
    [3, 1],
  ] as const) {
    pq.push(value, priority);
  }

  const drained: number[] = [];
  while (!pq.isEmpty) drained.push(pq.pop() as number);

  assert.deepEqual(drained.slice(0, 1), [1]);
  assert.equal(drained.length, 4);
  assert.deepEqual([...drained].sort((a, b) => a - b), [1, 3, 4, 5]);
});

test("peek does not remove the item", () => {
  const pq = new PriorityQueue<string>();
  pq.push("a", 1);
  assert.equal(pq.peek(), "a");
  assert.equal(pq.size, 1);
});
