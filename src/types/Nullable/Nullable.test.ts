import assert from "node:assert/strict";
import { test } from "node:test";

import type { Nullable } from "./Nullable.ts";

test("accepts both a value and null", () => {
  const a: Nullable<number> = 1;
  const b: Nullable<number> = null;
  assert.equal(a, 1);
  assert.equal(b, null);
});

test("rejects undefined at compile time — null and undefined are not the same", () => {
  // @ts-expect-error Nullable does not include undefined
  const c: Nullable<number> = undefined;
  assert.equal(c, undefined);
});
