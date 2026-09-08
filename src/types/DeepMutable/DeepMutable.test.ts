import assert from "node:assert/strict";
import { test } from "node:test";

import type { DeepMutable } from "./DeepMutable.ts";

interface Config {
  readonly server: { readonly host: string };
}

test("allows reassigning a nested property that was deeply readonly", () => {
  const config: DeepMutable<Config> = { server: { host: "h" } };
  config.server.host = "other";
  assert.equal(config.server.host, "other");
});
