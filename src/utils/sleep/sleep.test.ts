import assert from "node:assert/strict";
import { test } from "node:test";

import { sleep } from "./sleep.ts";

test("resolves to undefined", async () => {
  assert.equal(await sleep(1), undefined);
});

test("waits at least the given delay", async () => {
  const start = Date.now();
  await sleep(20);
  assert.ok(Date.now() - start >= 15);
});
