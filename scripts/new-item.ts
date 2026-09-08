#!/usr/bin/env node
// Maintainer-only scaffolder for this repo's catalog (`pnpm new <Name>`).
// Not part of the published CLI — consumers never see this.
import fs from "node:fs";
import path from "node:path";
import { parseArgs, styleText } from "node:util";

import * as p from "@clack/prompts";

import type { ItemType } from "../cli/types.ts";

const FOLDER: Record<ItemType, string> = { util: "utils", helper: "helpers", type: "types" };
const CASING: Record<ItemType, RegExp> = {
  util: /^[a-z][A-Za-z0-9]*$/,
  // helpers can be a function (camelCase, e.g. binarySearch) or a class
  // (PascalCase, e.g. LRUCache) — both are common for algorithms/patterns.
  helper: /^[A-Za-z][A-Za-z0-9]*$/,
  type: /^[A-Z][A-Za-z0-9]*$/,
};

function implTemplate(name: string, type: ItemType, header: string): string {
  if (type === "type") return `${header}export type ${name}<T> = T;\n`;
  if (type === "helper" && /^[A-Z]/.test(name)) {
    return `${header}export class ${name} {\n  // TODO: implement\n}\n`;
  }
  return `${header}export function ${name}() {\n  // TODO: implement\n}\n`;
}

function testTemplate(name: string, type: ItemType): string {
  if (type === "type") {
    return `import type { ${name} } from "./${name}.ts";

// Compile-only check — a bad type here fails \`pnpm lint\`, not \`pnpm test\`.
type _Check = ${name}<unknown>;
void (0 as unknown as _Check);
`;
  }
  if (type === "helper" && /^[A-Z]/.test(name)) {
    return `import assert from "node:assert/strict";
import { test } from "node:test";

import { ${name} } from "./${name}.ts";

test("TODO", () => {
  assert.ok(new ${name}());
});
`;
  }
  return `import assert from "node:assert/strict";
import { test } from "node:test";

import { ${name} } from "./${name}.ts";

test("TODO", () => {
  assert.equal(${name}(), undefined);
});
`;
}

async function main() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: { type: { type: "string", short: "t" } },
  });

  const name = positionals[0];
  if (!name) {
    console.error(styleText("red", "Usage: pnpm new <Name> [--type util|helper|type]"));
    process.exit(1);
  }

  p.intro(styleText(["bgCyan", "black"], " dufresne: new item "));

  let type = values.type as ItemType | undefined;
  if (!type || !(type in FOLDER)) {
    const picked = await p.select({
      message: "Kind?",
      options: [
        { value: "util", label: "util", hint: "a runtime function" },
        { value: "helper", label: "helper", hint: "algorithm, data structure or pattern (camelCase fn or PascalCase class)" },
        { value: "type", label: "type", hint: "pure TS type, no runtime code" },
      ],
    });
    if (p.isCancel(picked)) return p.outro(styleText("yellow", "Cancelled."));
    type = picked as ItemType;
  }

  if (!CASING[type].test(name)) {
    const example = type === "type" ? "DeepMerge" : "deepMerge";
    p.outro(styleText("red", `"${name}" doesn't match ${type} casing — try something like "${example}".`));
    process.exit(1);
  }

  const folder = path.join(process.cwd(), "src", FOLDER[type], name);
  const implPath = path.join(folder, `${name}.ts`);
  const testPath = path.join(folder, `${name}.test.ts`);

  if (fs.existsSync(implPath)) {
    p.outro(styleText("red", `${path.relative(process.cwd(), implPath)} already exists.`));
    process.exit(1);
  }

  const defaultCategory = FOLDER[type];
  const answers = await p.group(
    {
      description: () =>
        p.text({
          message: "@description (one line, shown in `dufresne list`)",
          validate: (v) => (v ? undefined : "Required"),
        }),
      category: () =>
        p.text({ message: "@category", initialValue: defaultCategory, defaultValue: defaultCategory }),
      tags: () => p.text({ message: "@tags (comma separated)", placeholder: "array, transform" }),
      usage: () =>
        p.select({
          message: "@usage",
          options: [
            { value: "high", label: "high" },
            { value: "medium", label: "medium" },
            { value: "low", label: "low" },
          ],
          initialValue: "medium",
        }),
    },
    {
      onCancel: () => {
        p.cancel("Cancelled.");
        process.exit(0);
      },
    },
  );

  const tags = answers.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .join(", ");

  const header = `/**
 * @name ${name}
 * @description ${answers.description}
 * @category ${answers.category}
 * @tags ${tags}
 * @usage ${answers.usage}
 *
 * @example
 * ${name}(); // TODO
 */
`;

  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(implPath, implTemplate(name, type, header));
  fs.writeFileSync(testPath, testTemplate(name, type));

  const rel = (f: string) => path.relative(process.cwd(), f);
  p.note(`${rel(implPath)}\n${rel(testPath)}`, "Created");
  p.outro(styleText("cyan", "Fill in the TODOs, then `pnpm registry` to add it to the catalog."));
}

main();
