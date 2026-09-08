import assert from "node:assert/strict";
import { test } from "node:test";

import type { ValueOf } from "./ValueOf.ts";

const STATUS = { ACTIVE: "active", DONE: "done" } as const;
type Status = ValueOf<typeof STATUS>;

test("accepts any of the object's values", () => {
  const a: Status = "active";
  const b: Status = "done";
  assert.equal(a, "active");
  assert.equal(b, "done");
});

test("rejects a value the object doesn't have at compile time", () => {
  // @ts-expect-error "pending" is not one of STATUS's values
  const c: Status = "pending";
  assert.equal(c, "pending");
});
