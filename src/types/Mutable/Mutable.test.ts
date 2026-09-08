import assert from "node:assert/strict";
import { test } from "node:test";

import type { Mutable } from "./Mutable.ts";

interface Config {
  readonly host: string;
  readonly port: number;
}

test("allows reassigning a property that was readonly on the source type", () => {
  const config: Mutable<Config> = { host: "h", port: 1 };
  config.host = "other";
  assert.equal(config.host, "other");
});
