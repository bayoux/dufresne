import assert from "node:assert/strict";
import { test } from "node:test";

import type { LiteralUnion } from "./LiteralUnion.ts";

type Size = LiteralUnion<"sm" | "md" | "lg", string>;

test("accepts one of the known literals", () => {
  const size: Size = "md";
  assert.equal(size, "md");
});

test("still accepts an arbitrary string", () => {
  const size: Size = "xl";
  assert.equal(size, "xl");
});
