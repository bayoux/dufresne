import assert from "node:assert/strict";
import { test } from "node:test";

import type { DeepRequired } from "./DeepRequired.ts";

interface Config {
  server?: { host?: string; port?: number };
  tags?: string[];
}

// Type-level check: this only compiles if every nested property is required
// (`tsc --noEmit` fails otherwise).
const full: DeepRequired<Config> = { server: { host: "h", port: 1 }, tags: ["a"] };

test("requires every nested property to be present", () => {
  assert.deepEqual(full, { server: { host: "h", port: 1 }, tags: ["a"] });
});

test("rejects an incomplete object at compile time", () => {
  // @ts-expect-error `server` is required now, and so is its `host`
  const incomplete: DeepRequired<Config> = {};
  assert.deepEqual(incomplete, {});
});
