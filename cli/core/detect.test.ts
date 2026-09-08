import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import { detectProject, parseJsonc } from "./detect.ts";

function projectDir(t: { after: (fn: () => void) => void }, files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dufresne-detect-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), content);
  }
  return dir;
}

test("parseJsonc tolerates comments, trailing commas and // inside strings", () => {
  const parsed = parseJsonc(`{
    // a line comment
    "url": "https://example.com", /* block */
    "nested": { "a": 1, },
  }`) as Record<string, unknown>;
  assert.equal(parsed.url, "https://example.com");
  assert.deepEqual(parsed.nested, { a: 1 });
});

test("derives kind folders from a catch-all '@/*' -> 'src/*'", (t) => {
  const dir = projectDir(t, {
    "tsconfig.json": JSON.stringify({
      compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
    }),
  });
  const d = detectProject(dir);
  assert.equal(d.source, "tsconfig.json");
  assert.equal(d.ts, true);
  assert.deepEqual(d.aliases, { utils: "@/utils", helpers: "@/helpers", types: "@/types" });
  assert.deepEqual(d.paths, { utils: "src/utils", helpers: "src/helpers", types: "src/types" });
});

test("prefers a direct alias match over the catch-all derivation", (t) => {
  const dir = projectDir(t, {
    "tsconfig.json": JSON.stringify({
      compilerOptions: {
        paths: { "@/*": ["src/*"], "@shared/utils/*": ["src/shared/utils/*"] },
      },
    }),
  });
  const d = detectProject(dir);
  assert.equal(d.aliases.utils, "@shared/utils");
  assert.equal(d.paths.utils, "src/shared/utils");
});

test("handles a Nuxt-style '~/*' -> './*'", (t) => {
  const dir = projectDir(t, {
    "jsconfig.json": JSON.stringify({ compilerOptions: { paths: { "~/*": ["./*"] } } }),
  });
  const d = detectProject(dir);
  assert.equal(d.ts, false);
  assert.equal(d.aliases.utils, "~/utils");
  assert.equal(d.paths.utils, "utils");
});

test("no ts/jsconfig -> empty detection", (t) => {
  const dir = projectDir(t, {});
  const d = detectProject(dir);
  assert.deepEqual(d, { source: null, aliases: {}, paths: {}, ts: undefined });
});
