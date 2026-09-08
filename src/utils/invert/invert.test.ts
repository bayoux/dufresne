import assert from "node:assert/strict";
import { test } from "node:test";

import { invert } from "./invert.ts";

test("swaps keys and values", () => {
  assert.deepEqual(invert({ a: "x", b: "y" }), { x: "a", y: "b" });
});

test("later keys win on duplicate values", () => {
  assert.deepEqual(invert({ a: "x", b: "x" }), { x: "b" });
});

test("returns {} for an empty object", () => {
  assert.deepEqual(invert({} as Record<string, string>), {});
});
