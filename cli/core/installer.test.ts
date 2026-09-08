import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import type { Config, RegistryItem } from "../types.ts";
import { appendBarrel, rewriteImports, targetInfo } from "./installer.ts";

const config: Config = {
  ts: true,
  case: "kebab",
  barrel: true,
  comments: true,
  aliases: { utils: "~/utils", helpers: "~/lib", types: "~/types" },
  paths: { utils: "app/utils", helpers: "app/lib", types: "app/types" },
};

test("rewriteImports maps @/utils, @/helpers and @/types to consumer aliases", () => {
  const out = rewriteImports(
    `import { compact } from '@/utils/compact/compact';
     import { toArray } from '@/helpers/toArray/toArray';
     import type { DeepPartial } from '@/types/DeepPartial/DeepPartial';`,
    config,
  );
  assert.match(out, /from '~\/utils\/compact'/);
  assert.match(out, /from '~\/lib\/to-array'/);
  assert.match(out, /from '~\/types\/deep-partial'/);
});

test("rewriteImports leaves npm and node imports untouched", () => {
  const src = `import fs from 'node:fs';\nimport dayjs from 'dayjs';`;
  assert.equal(rewriteImports(src, config), src);
});

test("targetInfo resolves path, extension and barrel for a util", () => {
  const item = { name: "deepMerge", type: "util", file: "utils/deepMerge/deepMerge.ts" } as RegistryItem;
  const info = targetInfo(item, config, "/project");
  assert.equal(info.base, "deep-merge");
  assert.equal(info.ext, ".ts");
  assert.equal(info.isTypeOnly, false);
  assert.match(info.filePath, /\/project\/app\/utils\/deep-merge\.ts$/);
  assert.match(info.barrelPath, /\/project\/app\/utils\/index\.ts$/);
});

test("targetInfo routes a type item to the types path, forcing .ts", () => {
  const item = {
    name: "Prettify",
    type: "type",
    file: "types/Prettify/Prettify.ts",
  } as RegistryItem;
  const info = targetInfo(item, { ...config, ts: false }, "/project");
  assert.equal(info.ext, ".ts");
  assert.equal(info.isTypeOnly, true);
  assert.match(info.filePath, /\/project\/app\/types\/prettify\.ts$/);
});

test("appendBarrel writes `export type *` for type-only items, `export *` otherwise", (t) => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "dufresne-installer-"));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));

  const typeItem = { name: "Prettify", type: "type", file: "types/Prettify/Prettify.ts" } as RegistryItem;
  const typeTarget = targetInfo(typeItem, config, cwd);
  fs.mkdirSync(typeTarget.dir, { recursive: true });
  appendBarrel(typeTarget);
  assert.equal(fs.readFileSync(typeTarget.barrelPath, "utf-8"), "export type * from './prettify';\n");

  const utilItem = { name: "chunk", type: "util", file: "utils/chunk/chunk.ts" } as RegistryItem;
  const utilTarget = targetInfo(utilItem, config, cwd);
  fs.mkdirSync(utilTarget.dir, { recursive: true });
  appendBarrel(utilTarget);
  assert.equal(fs.readFileSync(utilTarget.barrelPath, "utf-8"), "export * from './chunk';\n");
});
