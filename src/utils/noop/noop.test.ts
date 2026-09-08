import assert from "node:assert/strict";
import { test } from "node:test";

import { noop } from "./noop.ts";

test("returns undefined", () => {
  assert.equal(noop(), undefined);
});

test("ignores any arguments passed to it", () => {
  assert.equal((noop as (...args: unknown[]) => void)(1, 2, 3), undefined);
});
