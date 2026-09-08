import assert from "node:assert/strict";
import { test } from "node:test";

import { throttle } from "./throttle.ts";

test("calls immediately on the leading edge", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"] });
  let calls = 0;
  const fn = throttle(() => calls++, 100);

  fn();
  assert.equal(calls, 1);
});

test("ignores calls within the wait window, then fires once on the trailing edge", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"] });
  let calls = 0;
  const fn = throttle(() => calls++, 100);

  fn();
  t.mock.timers.tick(50);
  fn();
  fn();
  assert.equal(calls, 1);

  t.mock.timers.tick(50);
  assert.equal(calls, 2);
});

test("allows a new leading call once the wait window has fully elapsed", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"] });
  let calls = 0;
  const fn = throttle(() => calls++, 100);

  fn();
  t.mock.timers.tick(100);
  fn();

  assert.equal(calls, 2);
});

test("cancel drops a pending trailing call", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"] });
  let calls = 0;
  const fn = throttle(() => calls++, 100);

  fn();
  t.mock.timers.tick(50);
  fn();
  fn.cancel();
  t.mock.timers.tick(50);

  assert.equal(calls, 1);
});

test("the trailing call carries the most recent arguments", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"] });
  const seen: number[] = [];
  const fn = throttle((n: number) => seen.push(n), 100);

  fn(1);
  t.mock.timers.tick(50);
  fn(2);
  fn(3);
  t.mock.timers.tick(50);

  assert.deepEqual(seen, [1, 3]);
});
