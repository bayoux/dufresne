import assert from "node:assert/strict";
import { test } from "node:test";

import type { PartialBy } from "./PartialBy.ts";

interface User {
  id: string;
  name: string;
  email: string;
}

// Type-level check: `id` must be optional, `name`/`email` still required.
const newUser: PartialBy<User, "id"> = { name: "Ada", email: "ada@example.com" };

test("allows the picked key to be omitted", () => {
  assert.deepEqual(newUser, { name: "Ada", email: "ada@example.com" });
});

test("still accepts the picked key when provided", () => {
  const withId: PartialBy<User, "id"> = { id: "1", name: "Ada", email: "ada@example.com" };
  assert.equal(withId.id, "1");
});
