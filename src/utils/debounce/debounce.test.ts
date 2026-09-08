import assert from "node:assert/strict";
import { test } from "node:test";

import { debounce } from "./debounce.ts";

test("only runs once after the delay, on trailing calls", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let calls = 0;
  const debounced = debounce(() => {
    calls++;
  }, 100);

  debounced();
  debounced();
  debounced();
  assert.equal(calls, 0);

  t.mock.timers.tick(100);
  assert.equal(calls, 1);
});

test("cancel drops a pending call", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let calls = 0;
  const debounced = debounce(() => {
    calls++;
  }, 50);

  debounced();
  debounced.cancel();
  t.mock.timers.tick(50);
  assert.equal(calls, 0);
});

test("passes through only the latest call's arguments", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const seen: number[] = [];
  const debounced = debounce((n: number) => seen.push(n), 10);

  debounced(1);
  debounced(2);
  t.mock.timers.tick(10);

  assert.deepEqual(seen, [2]);
});
