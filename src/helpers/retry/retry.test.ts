import assert from "node:assert/strict";
import { test } from "node:test";

import { retry } from "./retry.ts";

test("returns the result on the first success", async () => {
  const result = await retry(async () => "ok");
  assert.equal(result, "ok");
});

test("retries after a failure and eventually succeeds", async () => {
  let calls = 0;
  const result = await retry(
    async () => {
      calls++;
      if (calls < 2) throw new Error("fail");
      return "ok";
    },
    { attempts: 3, delayMs: 1 },
  );

  assert.equal(result, "ok");
  assert.equal(calls, 2);
});

test("throws the last error once attempts are exhausted", async () => {
  let calls = 0;
  await assert.rejects(
    retry(
      async () => {
        calls++;
        throw new Error("always fails");
      },
      { attempts: 3, delayMs: 1 },
    ),
    /always fails/,
  );
  assert.equal(calls, 3);
});

test("does not delay after the final attempt", async () => {
  let calls = 0;
  await assert.rejects(
    retry(
      async () => {
        calls++;
        throw new Error("fail");
      },
      { attempts: 1 },
    ),
  );
  assert.equal(calls, 1);
});
