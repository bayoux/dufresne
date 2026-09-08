import assert from "node:assert/strict";
import { test } from "node:test";

import { after } from "./after.ts";

test("returns undefined before the count is reached", () => {
  const fn = after(3, () => "done");
  assert.equal(fn(), undefined);
  assert.equal(fn(), undefined);
});

test("runs fn from the count-th call onward", () => {
  const fn = after(2, () => "done");
  assert.equal(fn(), undefined);
  assert.equal(fn(), "done");
  assert.equal(fn(), "done");
});

test("runs immediately when count is 0 or negative", () => {
  const fn = after(0, () => "done");
  assert.equal(fn(), "done");
});
