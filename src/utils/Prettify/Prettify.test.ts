import assert from "node:assert/strict";
import { test } from "node:test";

import type { Prettify } from "./Prettify.ts";

type Merged = { a: string } & { b: number };

const value: Prettify<Merged> = { a: "x", b: 1 };

test("keeps every member after flattening", () => {
  assert.deepEqual(value, { a: "x", b: 1 });
});
