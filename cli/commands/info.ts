import { styleText } from "node:util";

import * as p from "@clack/prompts";

import { fetchRegistry } from "../core/http.ts";
import { suggest } from "../lib/suggest.ts";

export async function info(
  name: string | undefined,
  registrySource?: string,
  json = false,
): Promise<void> {
  if (json && !name) {
    console.error("Usage: dufresne info <name> --json");
    process.exit(1);
  }

  if (json) {
    try {
      const registry = await fetchRegistry(registrySource);
      const item = registry.items[name!];
      if (!item) {
        console.error(JSON.stringify({ error: `"${name}" is not in the registry.` }));
        process.exit(1);
      }
      console.log(JSON.stringify(item, null, 2));
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Unknown error");
      process.exit(1);
    }
    return;
  }

  p.intro(styleText("magenta", "info"));

  let registry;
  try {
    registry = await fetchRegistry(registrySource);
  } catch (error) {
    p.log.error(styleText("red", error instanceof Error ? error.message : "Unknown error"));
    process.exit(1);
  }

  let target = name;
  if (!target) {
    const picked = await p.autocomplete({
      message: "Pick an item",
      options: Object.values(registry.items)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((it) => ({ value: it.name, label: it.name, hint: `${it.type} · ${it.description}` })),
    });
    if (p.isCancel(picked)) {
      p.outro(styleText("yellow", "Cancelled."));
      return;
    }
    target = picked as string;
  }

  const item = registry.items[target];
  if (!item) {
    const near = suggest(target, Object.keys(registry.items));
    p.log.error(styleText("red", `"${target}" is not in the registry.`));
    if (near.length) p.log.info(styleText("dim", `Did you mean: ${near.join(", ")}?`));
    p.outro(styleText("dim", "Run `dufresne list`."));
    return;
  }

  const row = (label: string, value: string) =>
    `${styleText("dim", `${label}:`.padEnd(12))} ${value}`;

  const lines = [
    row("name", styleText("bold", item.name)),
    row("type", item.type),
    row("category", item.category),
    row("description", item.description),
  ];
  if (item.usage) lines.push(row("usage", item.usage));
  if (item.tags.length) lines.push(row("tags", item.tags.join(", ")));
  if (item.dependencies.internal.length) {
    lines.push(row("deps", item.dependencies.internal.join(", ")));
  }
  if (item.dependencies.npm.length) {
    lines.push(row("npm", item.dependencies.npm.join(", ")));
  }
  lines.push(row("source", `${registry.baseUrl}/${item.file}`));

  console.log(`\n${lines.join("\n")}\n`);

  if (item.examples.length) {
    console.log(styleText("dim", "examples"));
    for (const example of item.examples) {
      console.log(
        example
          .split("\n")
          .map((l) => `  ${styleText("cyan", l)}`)
          .join("\n"),
      );
      console.log("");
    }
  }

  p.outro(styleText("dim", `Add it with \`dufresne add ${item.name}\``));
}
