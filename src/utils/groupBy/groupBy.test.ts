import assert from "node:assert/strict";
import { test } from "node:test";

import { groupBy } from "./groupBy.ts";

test("groups numbers by parity", () => {
  assert.deepEqual(groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? "even" : "odd")), {
    odd: [1, 3],
    even: [2, 4],
  });
});

test("groups objects by a field", () => {
  const people = [
    { name: "Ada", team: "core" },
    { name: "Grace", team: "docs" },
    { name: "Alan", team: "core" },
  ];
  assert.deepEqual(groupBy(people, (p) => p.team), {
    core: [people[0], people[2]],
    docs: [people[1]],
  });
});

test("returns {} for an empty array", () => {
  assert.deepEqual(groupBy([], (n: number) => n), {});
});
