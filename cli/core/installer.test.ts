import assert from "node:assert/strict";
import { test } from "node:test";

import type { Config, RegistryItem } from "../types.ts";
import { rewriteImports, targetInfo } from "./installer.ts";

const config: Config = {
  ts: true,
  case: "kebab",
  barrel: true,
  aliases: { utils: "~/utils", helpers: "~/lib" },
  paths: { utils: "app/utils", helpers: "app/lib" },
};

test("rewriteImports maps @/utils and @/helpers to consumer aliases", () => {
  const out = rewriteImports(
    `import { compact } from '@/utils/compact/compact';
     import { toArray } from '@/helpers/toArray/toArray';`,
    config,
  );
  assert.match(out, /from '~\/utils\/compact'/);
  assert.match(out, /from '~\/lib\/to-array'/);
});

test("rewriteImports leaves npm and node imports untouched", () => {
  const src = `import fs from 'node:fs';\nimport dayjs from 'dayjs';`;
  assert.equal(rewriteImports(src, config), src);
});

test("targetInfo resolves path, extension and barrel", () => {
  const item = { name: "deepMerge", type: "util", file: "utils/deepMerge/deepMerge.ts" } as RegistryItem;
  const info = targetInfo(item, config, "/project");
  assert.equal(info.base, "deep-merge");
  assert.equal(info.ext, ".ts");
  assert.match(info.filePath, /\/project\/app\/utils\/deep-merge\.ts$/);
  assert.match(info.barrelPath, /\/project\/app\/utils\/index\.ts$/);
});
