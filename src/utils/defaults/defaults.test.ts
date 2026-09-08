import assert from "node:assert/strict";
import { test } from "node:test";

import { defaults } from "./defaults.ts";

interface Options {
  a?: number;
  b?: number;
  c?: number;
}

test("fills in missing properties from sources, first source wins", () => {
  const result = defaults<Options>({ a: 1 }, { a: 2, b: 2 }, { b: 3, c: 3 });
  assert.deepEqual(result, { a: 1, b: 2, c: 3 });
});

test("never overwrites an existing value, even a falsy one", () => {
  assert.deepEqual(defaults<Options>({ a: 0 }, { a: 1 }), { a: 0 });
});

test("does not mutate the base object", () => {
  const input: Options = { a: 1 };
  defaults(input, { b: 2 });
  assert.deepEqual(input, { a: 1 });
});
