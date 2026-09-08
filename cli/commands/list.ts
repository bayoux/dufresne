import { styleText } from "node:util";

import * as p from "@clack/prompts";

import { fetchRegistry } from "../core/http.ts";
import type { RegistryItem } from "../types.ts";

export interface ListFilters {
  query?: string | undefined;
  category?: string | undefined;
  tag?: string | undefined;
  json?: boolean | undefined;
}

function matches(item: RegistryItem, filters: ListFilters): boolean {
  if (filters.category && item.category.toLowerCase() !== filters.category.toLowerCase()) {
    return false;
  }
  if (filters.tag && !item.tags.some((t) => t.toLowerCase() === filters.tag!.toLowerCase())) {
    return false;
  }
  if (filters.query) {
    const haystack = [item.name, item.description, item.category, ...item.tags].join(" ").toLowerCase();
    if (!haystack.includes(filters.query.toLowerCase())) return false;
  }
  return true;
}

export async function list(registrySource?: string, filters: ListFilters = {}): Promise<void> {
  // --json is for scripts: no clack chrome, no ANSI, just data on stdout.
  if (filters.json) {
    try {
      const registry = await fetchRegistry(registrySource);
      const items = Object.values(registry.items).filter((item) => matches(item, filters));
      console.log(JSON.stringify(items, null, 2));
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Unknown error");
      process.exit(1);
    }
    return;
  }

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
  const items = Object.values(registry.items)
    .filter((item) => matches(item, filters))
    .sort((a, b) => {
      const byUsage = (rank[a.usage ?? ""] ?? 3) - (rank[b.usage ?? ""] ?? 3);
      return byUsage || a.name.localeCompare(b.name);
    });

  if (!items.length) {
    p.outro(styleText("dim", "No items match that filter."));
    return;
  }

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

  p.outro(styleText("dim", `${items.length} item${items.length === 1 ? "" : "s"} found.`));
}
