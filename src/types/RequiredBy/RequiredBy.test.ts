import assert from "node:assert/strict";
import { test } from "node:test";

import type { RequiredBy } from "./RequiredBy.ts";

interface Options {
  id?: string;
  label?: string;
}

// Type-level check: `id` must be present, `label` stays optional.
const withId: RequiredBy<Options, "id"> = { id: "1" };

test("still allows the untouched keys to be omitted", () => {
  assert.deepEqual(withId, { id: "1" });
});

test("rejects omitting the now-required key at compile time", () => {
  // @ts-expect-error `id` is required now
  const missingId: RequiredBy<Options, "id"> = { label: "x" };
  assert.deepEqual(missingId, { label: "x" });
});
