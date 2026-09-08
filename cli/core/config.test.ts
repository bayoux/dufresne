import assert from "node:assert/strict";
import { test } from "node:test";

import { DEFAULT_CONFIG, normalizeConfig } from "./config.ts";

test("normalizeConfig fills every field from a partial object", () => {
  const cfg = normalizeConfig({ aliases: { utils: "~/u" } });
  assert.equal(cfg.aliases.utils, "~/u");
  assert.equal(cfg.aliases.helpers, DEFAULT_CONFIG.aliases.helpers);
  assert.equal(cfg.ts, true);
  assert.equal(cfg.case, "kebab");
  assert.equal(cfg.barrel, true);
});

test("normalizeConfig respects explicit false and camel case", () => {
  const cfg = normalizeConfig({ ts: false, barrel: false, case: "camel" });
  assert.equal(cfg.ts, false);
  assert.equal(cfg.barrel, false);
  assert.equal(cfg.case, "camel");
});

test("normalizeConfig rejects non-objects", () => {
  assert.throws(() => normalizeConfig(null), /must be a JSON object/);
  assert.throws(() => normalizeConfig("nope"), /must be a JSON object/);
});
