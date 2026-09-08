import assert from "node:assert/strict";
import { test } from "node:test";

import { compact } from "./compact.ts";

test("drops every falsy value", () => {
  assert.deepEqual(compact([0, 1, false, 2, "", 3, null, undefined, NaN]), [1, 2, 3]);
});

test("returns [] when everything is falsy", () => {
  assert.deepEqual(compact([0, false, "", null]), []);
});

test("returns a new array unchanged when nothing is falsy", () => {
  const input = [1, 2, 3];
  assert.deepEqual(compact(input), [1, 2, 3]);
});
