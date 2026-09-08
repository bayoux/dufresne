import assert from "node:assert/strict";
import { test } from "node:test";

import type { Merge } from "./Merge.ts";

interface Base {
  id: string;
  name: string;
}
interface Override {
  name: number;
}

// Type-level check: `name` takes Override's (number) type, `id` stays from Base.
const merged: Merge<Base, Override> = { id: "1", name: 42 };

test("keeps the base's untouched properties", () => {
  assert.equal(merged.id, "1");
});

test("takes the overriding type's value for a shared key", () => {
  assert.equal(merged.name, 42);
});
