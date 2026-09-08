import assert from "node:assert/strict";
import { test } from "node:test";

import type { DeepReadonly } from "./DeepReadonly.ts";

interface Config {
  server: { host: string };
  tags: string[];
}

const config: DeepReadonly<Config> = { server: { host: "h" }, tags: ["a"] };

test("allows reading nested values", () => {
  assert.equal(config.server.host, "h");
  assert.deepEqual(config.tags, ["a"]);
});

test("rejects writing a nested property at compile time (readonly is TS-only, not enforced at runtime)", () => {
  // @ts-expect-error server.host is readonly
  config.server.host = "mutated";
  assert.equal(config.server.host, "mutated");
});
