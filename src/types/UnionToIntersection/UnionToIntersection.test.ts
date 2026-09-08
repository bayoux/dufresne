import assert from "node:assert/strict";
import { test } from "node:test";

import type { UnionToIntersection } from "./UnionToIntersection.ts";

type Combined = UnionToIntersection<{ a: string } | { b: number }>;

// Type-level check: a value must satisfy *both* union members at once now.
const combined: Combined = { a: "x", b: 1 };

test("requires every union member's properties at once", () => {
  assert.deepEqual(combined, { a: "x", b: 1 });
});
