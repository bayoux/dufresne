import fs from "node:fs";
import path from "node:path";
import { styleText } from "node:util";

import * as p from "@clack/prompts";

import { CONFIG_FILE, detectedConfig, findConfig, writeConfig } from "../core/config.ts";
import { fetchRegistry } from "../core/http.ts";
import { removeFromBarrel, removeItemFile, targetInfo } from "../core/installer.ts";
import type { TargetInfo } from "../core/installer.ts";
import { suggest } from "../lib/suggest.ts";
import type { RegistryItem } from "../types.ts";

export interface RemoveOptions {
  yes: boolean;
  registry?: string | undefined;
  cwd?: string | undefined;
}

export async function remove(names: string[], options: RemoveOptions): Promise<void> {
  p.intro(styleText(["bgCyan", "black"], " dufresne remove "));

  const cwd = path.resolve(options.cwd ?? process.cwd());

  const s = p.spinner();
  s.start("Loading registry...");
  let registry;
  try {
    registry = await fetchRegistry(options.registry);
    s.stop("Registry loaded");
  } catch (error) {
    s.stop(styleText("red", "Failed to load registry."));
    p.log.error(styleText("red", error instanceof Error ? error.message : "Unknown error"));
    process.exit(1);
  }

  const existing = findConfig(cwd);
  const config = existing ?? detectedConfig(cwd).config;

  const installed = Object.values(registry.items)
    .map((item) => ({ item, target: targetInfo(item, config, cwd) }))
    .filter(({ target }) => fs.existsSync(target.filePath));

  let requested = names;
  if (!requested.length) {
    if (!installed.length) {
      p.outro(styleText("dim", "Nothing installed from this registry to remove."));
      return;
    }
    const picked = await p.multiselect({
      message: "Remove which items?",
      options: installed.map(({ item }) => ({ value: item.name, label: item.name })),
      required: false,
    });
    if (p.isCancel(picked)) {
      p.outro(styleText("yellow", "Cancelled."));
      return;
    }
    requested = picked as string[];
  }

  if (!requested.length) {
    p.outro(styleText("dim", "Nothing selected."));
    return;
  }

  const targets: Array<{ item: RegistryItem; target: TargetInfo }> = [];
  for (const name of requested) {
    const item = registry.items[name];
    if (!item) {
      const near = suggest(name, Object.keys(registry.items));
      p.log.warn(
        styleText(
          "yellow",
          `"${name}" is not in the registry.${near.length ? ` Did you mean: ${near.join(", ")}?` : ""}`,
        ),
      );
      continue;
    }
    const found = installed.find((i) => i.item.name === name);
    if (!found) {
      p.log.warn(styleText("yellow", `${name} isn't installed here.`));
      continue;
    }
    targets.push(found);
  }

  if (!targets.length) {
    p.outro(styleText("dim", "Nothing to remove."));
    return;
  }

  if (!options.yes) {
    const proceed = await p.confirm({
      message: `Delete ${styleText("bold", targets.map((t) => t.item.name).join(", "))}? This removes the file(s) and barrel export only — npm packages are left alone.`,
      initialValue: false,
    });
    if (p.isCancel(proceed) || !proceed) {
      p.outro(styleText("yellow", "Cancelled."));
      return;
    }
  }

  const removed: string[] = [];
  const npmHints = new Set<string>();
  for (const { item, target } of targets) {
    removeItemFile(target);
    removeFromBarrel(target);
    removed.push(item.name);
    for (const pkg of item.dependencies.npm) npmHints.add(pkg);
  }

  if (existing && removed.length) {
    const remaining = existing.items.filter((n) => !removed.includes(n));
    if (remaining.length !== existing.items.length) {
      writeConfig(cwd, { ...existing, items: remaining });
      p.log.info(styleText("dim", `Removed from ${CONFIG_FILE} too.`));
    }
  }

  p.note(removed.map((n) => styleText("green", n)).join("\n"), "Removed");
  if (npmHints.size) {
    p.log.info(
      styleText("dim", `Left untouched — remove manually if nothing else needs them: ${[...npmHints].join(", ")}`),
    );
  }
  p.outro(styleText("cyan", `Done — ${removed.length} item${removed.length === 1 ? "" : "s"} removed.`));
}
