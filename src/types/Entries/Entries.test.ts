import assert from "node:assert/strict";
import { test } from "node:test";

import type { Entries } from "./Entries.ts";

interface User {
  id: string;
  age: number;
}

test("types Object.entries precisely instead of as [string, any][]", () => {
  const user: User = { id: "1", age: 30 };
  const entries = Object.entries(user) as Entries<User>;

  assert.deepEqual(entries, [
    ["id", "1"],
    ["age", 30],
  ]);
});
