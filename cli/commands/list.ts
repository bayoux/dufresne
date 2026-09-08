import { styleText } from "node:util";

import * as p from "@clack/prompts";

import { fetchRegistry } from "../core/http.ts";

export async function list(registrySource?: string): Promise<void> {
  p.intro(styleText("magenta", "Available items"));

  const s = p.spinner();
  s.start("Loading registry...");

  let registry;
  try {
    registry = await fetchRegistry(registrySource);
    s.stop("Registry loaded");
  } catch (error) {
    s.stop(styleText("red", "Failed to fetch list."));
    p.log.error(styleText("red", error instanceof Error ? error.message : "Unknown error"));
    process.exit(1);
  }

  const rank: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const items = Object.values(registry.items).sort((a, b) => {
    const byUsage = (rank[a.usage ?? ""] ?? 3) - (rank[b.usage ?? ""] ?? 3);
    return byUsage || a.name.localeCompare(b.name);
  });

  const lines = items.map((item) => {
    const badges: string[] = [];
    if (item.dependencies.internal.length) {
      badges.push(styleText("blue", `deps: ${item.dependencies.internal.join(", ")}`));
    }
    if (item.dependencies.npm.length) {
      badges.push(styleText("yellow", `npm: ${item.dependencies.npm.join(", ")}`));
    }
    const meta = badges.length ? styleText("dim", `  [${badges.join(" | ")}]`) : "";
    const type = styleText("dim", item.type.padEnd(6));
    const usage = styleText("dim", (item.usage ?? "").padEnd(6));

    return `${styleText("cyan", "•")} ${type} ${usage} ${styleText("bold", item.name.padEnd(18))} ${styleText("dim", item.description)}${meta}`;
  });

  console.log(lines.join("\n"));
  console.log("");

  p.outro(styleText("dim", `${items.length} items found.`));
}
