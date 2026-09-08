import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

import { extractDependencies, hashContent, matchJsdoc, parseMetadata } from "../cli/lib/metadata.ts";
import type { ItemType, Registry, RegistryItem } from "../cli/types.ts";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const OUT = join(ROOT, "registry.json");
const BASE_URL = "https://raw.githubusercontent.com/enqrose/dufresne/main/src";

/** Top-level folder under src/ -> item type. */
const TYPE_DIRS: Record<string, ItemType> = { utils: "util", helpers: "helper", types: "type" };

function findImpl(dir: string, name: string): string | null {
  for (const ext of [".ts", ".tsx"]) {
    const candidate = join(dir, `${name}${ext}`);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function collect(): { items: RegistryItem[]; errors: string[] } {
  const items: RegistryItem[] = [];
  const errors: string[] = [];

  for (const [folder, type] of Object.entries(TYPE_DIRS)) {
    const typeDir = join(SRC, folder);
    if (!existsSync(typeDir)) continue;

    for (const name of readdirSync(typeDir)) {
      const itemDir = join(typeDir, name);
      if (!statSync(itemDir).isDirectory()) continue;

      const impl = findImpl(itemDir, name);
      if (!impl) {
        errors.push(`${folder}/${name}: expected an implementation file ${name}.ts`);
        continue;
      }

      const content = readFileSync(impl, "utf-8");
      const rel = relative(SRC, impl).replace(/\\/g, "/");
      const meta = parseMetadata(content, rel);

      if (!matchJsdoc(content)) errors.push(`${rel}: missing a JSDoc header block`);
      if (!meta.description) errors.push(`${rel}: JSDoc @description is required`);
      if (meta.name && meta.name !== name) {
        errors.push(`${rel}: @name "${meta.name}" does not match folder "${name}"`);
      }
      if (!existsSync(join(itemDir, `${name}.test.ts`))) {
        errors.push(`${folder}/${name}: missing ${name}.test.ts`);
      }

      items.push({
        id: `dfr-${hashContent(rel).slice(0, 8)}`,
        type,
        name,
        file: rel,
        description: meta.description || `Utility from ${rel}`,
        category: meta.category,
        tags: meta.tags,
        ...(meta.usage ? { usage: meta.usage } : {}),
        examples: meta.examples,
        hash: hashContent(content),
        dependencies: extractDependencies(content),
      });
    }
  }

  return { items: items.sort((a, b) => a.name.localeCompare(b.name)), errors };
}

function build(): void {
  const { items, errors } = collect();

  if (errors.length) {
    console.error("✖ registry validation failed:");
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  const registry: Registry = {
    schemaVersion: "2",
    baseUrl: BASE_URL,
    items: Object.fromEntries(items.map((item) => [item.name, item])),
  };

  writeFileSync(OUT, `${JSON.stringify(registry, null, 2)}\n`);
  console.log(`✅ registry.json — ${items.length} items`);
}

build();
