import assert from "node:assert/strict";
import { test } from "node:test";

import type { XOR } from "./XOR.ts";

interface ById {
  id: string;
}
interface ByName {
  name: string;
}
type Lookup = XOR<ById, ByName>;

test("accepts either shape on its own", () => {
  const byId: Lookup = { id: "1" };
  const byName: Lookup = { name: "a" };
  assert.deepEqual(byId, { id: "1" });
  assert.deepEqual(byName, { name: "a" });
});

test("rejects mixing both shapes at compile time", () => {
  // @ts-expect-error id and name can't both be present
  const both: Lookup = { id: "1", name: "a" };
  assert.deepEqual(both, { id: "1", name: "a" });
});
