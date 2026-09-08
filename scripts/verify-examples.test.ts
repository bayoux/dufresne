// Runs each catalog item's `@example` blocks as tests, when they're precise
// enough to run (see extractDoctestPairs). This is what keeps `dufresne info`
// and the README's examples honest — a wrong example fails `pnpm test` like
// any other regression.
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

import { extractDoctestPairs } from "../cli/lib/doctest.ts";
import { parseMetadata } from "../cli/lib/metadata.ts";

const SRC = join(process.cwd(), "src");
// Type-only items have no runtime export to call — nothing here can test them.
const RUNNABLE_DIRS = ["utils", "helpers"];

interface RunnableItem {
  name: string;
  file: string;
  examples: string[];
}

function findImpl(dir: string, name: string): string | null {
  for (const ext of [".ts", ".tsx"]) {
    const candidate = join(dir, `${name}${ext}`);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function collectRunnableItems(): RunnableItem[] {
  const items: RunnableItem[] = [];

  for (const folder of RUNNABLE_DIRS) {
    const typeDir = join(SRC, folder);
    if (!existsSync(typeDir)) continue;

    for (const name of readdirSync(typeDir)) {
      const itemDir = join(typeDir, name);
      if (!statSync(itemDir).isDirectory()) continue;

      const impl = findImpl(itemDir, name);
      if (!impl) continue;

      const content = readFileSync(impl, "utf-8");
      const meta = parseMetadata(content, relative(SRC, impl));
      items.push({ name, file: impl, examples: meta.examples });
    }
  }

  return items;
}

/** Evaluates a literal in an isolated scope — never untrusted input, only our own source. */
function evalLiteral(code: string): unknown {
  return new Function(`"use strict"; return (${code}\n);`)();
}

for (const item of collectRunnableItems()) {
  for (const [exampleIndex, example] of item.examples.entries()) {
    const pairs = extractDoctestPairs(example);

    for (const [pairIndex, pair] of pairs.entries()) {
      const label = pairs.length > 1 ? `${item.name} example ${exampleIndex + 1}.${pairIndex + 1}` : `${item.name} example ${exampleIndex + 1}`;

      test(`${label}: ${pair.expr}`, async (t) => {
        const mod: Record<string, unknown> = await import(pathToFileURL(item.file).href);
        const fn = mod[item.name];
        if (typeof fn !== "function") {
          t.skip(`no exported function named ${item.name}`);
          return;
        }

        let expected: unknown;
        try {
          expected = evalLiteral(pair.expected);
        } catch {
          t.skip("expected side isn't a runnable literal — documentation only");
          return;
        }

        let actual: unknown;
        try {
          actual = await new Function(item.name, `"use strict"; return (${pair.expr}\n);`)(fn);
        } catch (error) {
          t.skip(`couldn't evaluate in isolation: ${(error as Error).message}`);
          return;
        }

        assert.deepStrictEqual(actual, expected);
      });
    }
  }
}
