import assert from "node:assert/strict";
import { test } from "node:test";

import { countBy } from "./countBy.ts";

test("counts items per group", () => {
  assert.deepEqual(
    countBy([1, 2, 3, 4, 5], (n) => (n % 2 === 0 ? "even" : "odd")),
    { odd: 3, even: 2 },
  );
});

test("returns {} for an empty array", () => {
  assert.deepEqual(countBy([], (n: number) => n), {});
});
