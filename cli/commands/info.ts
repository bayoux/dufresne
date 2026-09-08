import { styleText } from "node:util";

import * as p from "@clack/prompts";

import { fetchRegistry } from "../core/http.ts";

export async function info(name: string | undefined, registrySource?: string): Promise<void> {
  if (!name) {
    console.error(styleText("red", "Usage: dufresne info <name>"));
    process.exitCode = 1;
    return;
  }

  p.intro(styleText("magenta", `info: ${name}`));

  let registry;
  try {
    registry = await fetchRegistry(registrySource);
  } catch (error) {
    p.log.error(styleText("red", error instanceof Error ? error.message : "Unknown error"));
    process.exit(1);
  }

  const item = registry.items[name];
  if (!item) {
    const near = Object.keys(registry.items)
      .filter((n) => n.includes(name) || name.includes(n))
      .slice(0, 5);
    p.log.error(styleText("red", `"${name}" is not in the registry.`));
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
