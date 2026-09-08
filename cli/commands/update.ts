import fs from "node:fs";
import path from "node:path";
import { styleText } from "node:util";

import * as p from "@clack/prompts";

import { detectedConfig, findConfig } from "../core/config.ts";
import { fetchRegistry, loadItemContent } from "../core/http.ts";
import { rewriteImports, targetInfo } from "../core/installer.ts";
import { suggest } from "../lib/suggest.ts";
import { stripJsdoc } from "../lib/transform.ts";
import type { Config, RegistryItem } from "../types.ts";

export interface UpdateOptions {
  all: boolean;
  yes: boolean;
  registry?: string | undefined;
  cwd?: string | undefined;
  jsdoc?: boolean | undefined;
}

interface Checked {
  item: RegistryItem;
  filePath: string;
  content: string;
  current: string;
}

export async function update(names: string[], options: UpdateOptions): Promise<void> {
  p.intro(styleText(["bgCyan", "black"], " dufresne update "));

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

  const config: Config = findConfig(cwd) ?? detectedConfig(cwd).config;
  const keepComments = options.jsdoc ?? config.comments;

  // A name is a candidate only if it's in the registry AND already on disk —
  // `update` re-syncs what's there, it doesn't install anything new (`add` does that).
  const candidateNames = names.length ? names : Object.keys(registry.items);
  const installed = candidateNames
    .map((name) => registry.items[name])
    .filter((item): item is RegistryItem => Boolean(item))
    .map((item) => ({ item, target: targetInfo(item, config, cwd) }))
    .filter(({ target }) => fs.existsSync(target.filePath));

  if (names.length) {
    for (const name of names) {
      if (installed.some(({ item }) => item.name === name)) continue;
      if (!registry.items[name]) {
        const near = suggest(name, Object.keys(registry.items));
        p.log.warn(
          styleText(
            "yellow",
            `"${name}" is not in the registry.${near.length ? ` Did you mean: ${near.join(", ")}?` : ""}`,
          ),
        );
      } else {
        p.log.warn(styleText("yellow", `${name} isn't installed here — use \`dufresne add ${name}\`.`));
      }
    }
  }

  if (!installed.length) {
    p.outro(styleText("dim", "Nothing installed from this registry to update."));
    return;
  }

  const check = p.spinner();
  check.start(`Checking ${installed.length} item${installed.length === 1 ? "" : "s"}...`);
  let checked: Checked[];
  try {
    checked = await Promise.all(
      installed.map(async ({ item, target }) => {
        const raw = await loadItemContent(registry, item.file, options.registry);
        const content = rewriteImports(keepComments ? raw : stripJsdoc(raw), config);
        const current = fs.readFileSync(target.filePath, "utf-8");
        return { item, filePath: target.filePath, content, current };
      }),
    );
    check.stop("Checked");
  } catch (error) {
    check.stop(styleText("red", "Check failed."));
    p.log.error(styleText("red", error instanceof Error ? error.message : "Unknown error"));
    process.exit(1);
  }

  const modified = checked.filter((c) => c.current !== c.content);

  if (!modified.length) {
    p.outro(styleText("cyan", `Up to date — ${checked.length} item${checked.length === 1 ? "" : "s"} checked.`));
    return;
  }

  p.log.info(
    styleText("dim", `${modified.length} of ${checked.length} differ from the registry.`),
  );

  let toApply = modified;

  // Bare `dufresne update` (no names, no --all): let the user pick which of the
  // modified items to actually rewrite.
  if (!names.length && !options.all) {
    const picked = await p.multiselect({
      message: "Apply the update to which items?",
      options: modified.map((c) => ({ value: c.item.name, label: c.item.name })),
      initialValues: modified.map((c) => c.item.name),
      required: false,
    });
    if (p.isCancel(picked)) {
      p.outro(styleText("yellow", "Cancelled."));
      return;
    }
    const set = new Set(picked as string[]);
    toApply = modified.filter((c) => set.has(c.item.name));
  }

  if (!toApply.length) {
    p.outro(styleText("dim", "Nothing selected."));
    return;
  }

  if (!options.yes) {
    const proceed = await p.confirm({
      message: `Overwrite ${styleText("bold", toApply.map((c) => c.item.name).join(", "))}?`,
      initialValue: true,
    });
    if (p.isCancel(proceed) || !proceed) {
      p.outro(styleText("yellow", "Cancelled."));
      return;
    }
  }

  for (const { filePath, content } of toApply) {
    fs.writeFileSync(filePath, content, { encoding: "utf-8", mode: 0o644 });
  }

  p.note(toApply.map((c) => styleText("green", c.item.name)).join("\n"), "Updated");
  p.outro(styleText("cyan", `Done — ${toApply.length} file${toApply.length === 1 ? "" : "s"} written.`));
}
