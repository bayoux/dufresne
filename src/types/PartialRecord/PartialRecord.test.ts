import assert from "node:assert/strict";
import { test } from "node:test";

import type { PartialRecord } from "./PartialRecord.ts";

type Flags = PartialRecord<"dev" | "prod", boolean>;

test("allows leaving some keys out", () => {
  const flags: Flags = { dev: true };
  assert.deepEqual(flags, { dev: true });
});

test("allows an entirely empty object", () => {
  const flags: Flags = {};
  assert.deepEqual(flags, {});
});
