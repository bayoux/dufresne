import assert from "node:assert/strict";
import { test } from "node:test";

import { identity } from "./identity.ts";

test("returns its argument unchanged", () => {
  assert.equal(identity(42), 42);
  const obj = { a: 1 };
  assert.equal(identity(obj), obj);
});

test("works as a default map callback", () => {
  assert.deepEqual([1, 2, 3].map(identity), [1, 2, 3]);
});
