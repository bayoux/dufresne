import assert from "node:assert/strict";
import { test } from "node:test";

import { zip } from "./zip.ts";

test("groups elements at the same index", () => {
  assert.deepEqual(
    zip(["a", "b"], [1, 2], [true, false]),
    [
      ["a", 1, true],
      ["b", 2, false],
    ],
  );
});

test("pads shorter arrays with undefined", () => {
  assert.deepEqual(zip(["a", "b", "c"], [1, 2]), [
    ["a", 1],
    ["b", 2],
    ["c", undefined],
  ]);
});

test("returns [] when called with no arrays", () => {
  assert.deepEqual(zip(), []);
});
