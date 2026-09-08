import assert from "node:assert/strict";
import { test } from "node:test";

import { zipObject } from "./zipObject.ts";

test("builds an object from parallel key/value arrays", () => {
  assert.deepEqual(zipObject(["a", "b"], [1, 2]), { a: 1, b: 2 });
});

test("builds an object from [key, value] pairs", () => {
  assert.deepEqual(
    zipObject([
      ["a", 1],
      ["b", 2],
    ]),
    { a: 1, b: 2 },
  );
});

test("returns {} for empty input", () => {
  assert.deepEqual(zipObject([], []), {});
});
