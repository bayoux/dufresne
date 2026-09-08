import assert from "node:assert/strict";
import { test } from "node:test";

import { pluck } from "./pluck.ts";

test("extracts the given property from every item", () => {
  assert.deepEqual(
    pluck(
      [
        { id: 1, name: "a" },
        { id: 2, name: "b" },
      ],
      "name",
    ),
    ["a", "b"],
  );
});

test("returns [] for an empty array", () => {
  assert.deepEqual(pluck([] as Array<{ id: number }>, "id"), []);
});
