import assert from "node:assert/strict";
import { test } from "node:test";

import type { DeepPartial } from "./DeepPartial.ts";

interface Config {
  server: { host: string; port: number };
  tags: string[];
}

// Type-level check: this only compiles if nested properties are optional too
// (`tsc --noEmit` fails otherwise).
const partialConfig: DeepPartial<Config> = { server: { host: "localhost" } };

test("allows a deeply partial object to satisfy the type", () => {
  assert.deepEqual(partialConfig, { server: { host: "localhost" } });
});

test("still allows a fully-populated object", () => {
  const full: DeepPartial<Config> = { server: { host: "h", port: 1 }, tags: ["a"] };
  assert.deepEqual(full, { server: { host: "h", port: 1 }, tags: ["a"] });
});
