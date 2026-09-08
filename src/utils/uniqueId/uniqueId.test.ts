import assert from "node:assert/strict";
import { test } from "node:test";

import { uniqueId } from "./uniqueId.ts";

test("returns a different id on every call", () => {
  const a = uniqueId();
  const b = uniqueId();
  const c = uniqueId();
  assert.notEqual(a, b);
  assert.notEqual(b, c);
});

test("increments by exactly one each call", () => {
  const a = Number(uniqueId());
  const b = Number(uniqueId());
  assert.equal(b, a + 1);
});

test("prepends the given prefix", () => {
  assert.match(uniqueId("id_"), /^id_\d+$/);
});
