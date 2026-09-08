import assert from "node:assert/strict";
import { test } from "node:test";

import type { JsonValue } from "./JsonValue.ts";

test("accepts nested primitives, arrays and objects", () => {
  const config: JsonValue = { a: 1, b: [true, null, "x"], c: { nested: 2 } };
  assert.equal(JSON.parse(JSON.stringify(config)).c.nested, 2);
});

test("rejects a value that can't survive JSON round-tripping, at compile time", () => {
  // @ts-expect-error a function is not a valid JsonValue
  const bad: JsonValue = () => {};
  assert.equal(typeof bad, "function");
});
