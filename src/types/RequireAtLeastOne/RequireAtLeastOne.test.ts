import assert from "node:assert/strict";
import { test } from "node:test";

import type { RequireAtLeastOne } from "./RequireAtLeastOne.ts";

interface Filters {
  id?: string;
  email?: string;
  phone?: string;
}
type Search = RequireAtLeastOne<Filters, "id" | "email" | "phone">;

test("accepts an object with just one of the required-ish keys", () => {
  const byEmail: Search = { email: "a@b.com" };
  assert.deepEqual(byEmail, { email: "a@b.com" });
});

test("still allows more than one to be present", () => {
  const both: Search = { id: "1", email: "a@b.com" };
  assert.deepEqual(both, { id: "1", email: "a@b.com" });
});

test("rejects an object with none of them at compile time", () => {
  // @ts-expect-error at least one of id/email/phone is required
  const none: Search = {};
  assert.deepEqual(none, {});
});
