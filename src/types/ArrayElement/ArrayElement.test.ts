import assert from "node:assert/strict";
import { test } from "node:test";

import type { ArrayElement } from "./ArrayElement.ts";

const sizes = ["sm", "md", "lg"] as const;
type Size = ArrayElement<typeof sizes>;

test("accepts any element already in the array", () => {
  const size: Size = "md";
  assert.ok(sizes.includes(size));
});

test("matches the element type for a plain array too", () => {
  type NumberItem = ArrayElement<number[]>;
  const n: NumberItem = 42;
  assert.equal(n, 42);
});
