import assert from "node:assert/strict";
import { test } from "node:test";

import type { DistributiveOmit } from "./DistributiveOmit.ts";

type Shape = { kind: "circle"; r: number } | { kind: "square"; s: number };
type WithoutKind = DistributiveOmit<Shape, "kind">;

test("keeps each union member's own fields, distributed", () => {
  const circle: WithoutKind = { r: 5 };
  const square: WithoutKind = { s: 5 };
  assert.deepEqual(circle, { r: 5 });
  assert.deepEqual(square, { s: 5 });
});
