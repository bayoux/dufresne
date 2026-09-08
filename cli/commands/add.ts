import fs from "node:fs";
import path from "node:path";
import { styleText } from "node:util";

import * as p from "@clack/prompts";

import { CONFIG_FILE, detectedConfig, findConfig, writeConfig } from "../core/config.ts";
import { fetchRegistry, loadItemContent } from "../core/http.ts";
import {
  appendBarrel,
  importAlias,
  rewriteImports,
  targetInfo,
  writeItemFile,
} from "../core/installer.ts";
import { detectPackageManager, installPackages } from "../core/pm.ts";
import { resolveDependencies } from "../core/registry.ts";
import { suggest } from "../lib/suggest.ts";
import { stripJsdoc } from "../lib/transform.ts";
import type { Config, RegistryItem } from "../types.ts";

export interface AddOptions {
  overwrite: boolean;
  all: boolean;
  /** Skip every confirmation (overwrite + package install) and proceed. */
  yes: boolean;
  /** Print the install plan and exit without writing or fetching sources. */
  dryRun: boolean;
  registry?: string | undefined;
  cwd?: string | undefined;
  /** `true` keep JSDoc, `false` strip it, `undefined` follow config. */
  jsdoc?: boolean | undefined;
}

const bail = (msg: string, error?: unknown): never => {
  p.log.error(styleText("red", error instanceof Error ? error.message : msg));
  p.outro(styleText("red", msg));
  process.exit(1);
};

export async function add(names: string[], options: AddOptions): Promise<void> {
  p.intro(
    `${styleText(["bgCyan", "black"], " dufresne ")} ${styleText("dim", process.env.VERSION ?? "dev")}`,
  );

  const cwd = path.resolve(options.cwd ?? process.cwd());

  const s = p.spinner();
  s.start("Loading registry...");
  let registry;
  try {
    registry = await fetchRegistry(options.registry);
    s.stop("Registry loaded");
  } catch (error) {
    s.stop(styleText("red", "Failed to load registry."));
    return bail("Failed to load registry.", error);
  }

  const allNames = Object.keys(registry.items).sort();
  let selected = options.all ? allNames : names;

  if (!selected.length) {
    const picked = await p.autocompleteMultiselect({
      message: "Search and select items to add",
      options: allNames.map((name) => {
        const item = registry.items[name]!;
        return { value: name, label: name, hint: `${item.type} · ${item.description}` };
      }),
      required: false,
    });
    if (p.isCancel(picked)) {
      p.outro(styleText("yellow", "Cancelled."));
      return;
    }
    selected = picked as string[];
  }

  if (!selected.length) {
    p.outro(styleText("dim", "Nothing selected."));
    return;
  }

  // Typos in explicit/`--all` names never happen for `--all` (it's built from
  // the registry's own keys), but drop-with-a-suggestion is friendlier than a
  // hard failure for a hand-typed name.
  const known: string[] = [];
  for (const name of selected) {
    if (registry.items[name]) {
      known.push(name);
      continue;
    }
    const near = suggest(name, allNames);
    p.log.warn(
      styleText(
        "yellow",
        `"${name}" is not in the registry.${near.length ? ` Did you mean: ${near.join(", ")}?` : ""}`,
      ),
    );
  }
  selected = known;

  if (!selected.length) {
    p.outro(styleText("dim", "Nothing to add."));
    return;
  }

  let plan;
  try {
    plan = resolveDependencies(registry, selected);
  } catch (error) {
    return bail("Check the list with `dufresne list`.", error);
  }

  // --- resolve config: explicit file, else defaults + detected project aliases
  let config: Config;
  const existing = findConfig(cwd);
  if (existing) {
    config = existing;
  } else {
    const detected = detectedConfig(cwd);
    config = detected.config;
    p.log.info(
      styleText(
        "dim",
        detected.detection.source
          ? `No ${CONFIG_FILE} — matched aliases from ${detected.detection.source} (\`dufresne init\` to lock them in).`
          : `No ${CONFIG_FILE} — using defaults (\`dufresne init\` to configure).`,
      ),
    );
  }

  const keepComments = options.jsdoc ?? config.comments;

  const extra = plan.items.filter((i) => !selected.includes(i.name));
  if (extra.length) {
    p.log.info(styleText("dim", `+ dependencies: ${extra.map((i) => i.name).join(", ")}`));
  }

  if (options.dryRun) {
    const rows = plan.items.map((item) => {
      const target = targetInfo(item, config, cwd);
      const rel = path.relative(cwd, target.filePath);
      const tag = fs.existsSync(target.filePath) ? styleText("yellow", "exists") : styleText("green", "new");
      return `${styleText("cyan", "•")} ${rel} ${styleText("dim", `(${tag})`)}`;
    });
    p.note(rows.join("\n"), "Would write");
    if (plan.npm.length) p.log.info(styleText("dim", `Would install: ${plan.npm.join(", ")}`));
    p.outro(styleText("dim", "Dry run — nothing written."));
    return;
  }

  // --- fetch every source in parallel
  const total = plan.items.length;
  let fetched = 0;
  const fetcher = p.spinner();
  fetcher.start(`Fetching sources 0/${total}`);
  let sources: Array<{ item: RegistryItem; raw: string }>;
  try {
    sources = await Promise.all(
      plan.items.map((item) =>
        loadItemContent(registry, item.file, options.registry).then((raw) => {
          fetcher.message(`Fetching sources ${++fetched}/${total} (${item.name})`);
          return { item, raw };
        }),
      ),
    );
    fetcher.stop(`Fetched ${total} source${total === 1 ? "" : "s"}`);
  } catch (error) {
    fetcher.stop(styleText("red", "Fetch failed."));
    return bail("Fetch failed.", error);
  }

  // --- write sequentially (only overwrite prompts pause here)
  const added: string[] = [];
  const addedItems: RegistryItem[] = [];
  const unchanged: string[] = [];
  const skipped: string[] = [];

  for (const { item, raw } of sources) {
    const content = rewriteImports(keepComments ? raw : stripJsdoc(raw), config);
    const target = targetInfo(item, config, cwd);

    if (fs.existsSync(target.filePath)) {
      if (fs.readFileSync(target.filePath, "utf-8") === content) {
        unchanged.push(item.name);
        continue;
      }
      if (!options.overwrite && !options.yes) {
        const ok = await p.confirm({
          message: `${styleText("bold", `${target.base}${target.ext}`)} differs — ${styleText("yellow", "overwrite?")}`,
          initialValue: false,
        });
        if (p.isCancel(ok) || !ok) {
          skipped.push(item.name);
          continue;
        }
      }
    }

    writeItemFile(target, content);
    if (config.barrel) appendBarrel(target);
    added.push(item.name);
    addedItems.push(item);
  }

  // --- record the newly added items in dufresne.json, if one exists
  if (existing && added.length) {
    const declared = new Set(existing.items);
    let changed = false;
    for (const name of added) {
      if (!declared.has(name)) {
        declared.add(name);
        changed = true;
      }
    }
    if (changed) {
      writeConfig(cwd, { ...existing, items: [...declared].sort() });
      p.log.info(styleText("dim", `Recorded in ${CONFIG_FILE} — \`dufresne sync\` reinstalls this set.`));
    }
  }

  // --- npm packages
  if (added.length && plan.npm.length) {
    const pm = detectPackageManager(cwd);
    const proceed = options.yes
      ? true
      : await p.confirm({
          message: `Install ${styleText("bold", plan.npm.join(", "))} with ${styleText("cyan", pm)}?`,
          initialValue: true,
        });
    if (!p.isCancel(proceed) && proceed) {
      const inst = p.spinner();
      inst.start(`Installing ${plan.npm.length} package${plan.npm.length === 1 ? "" : "s"}...`);
      try {
        installPackages(pm, plan.npm, cwd);
        inst.stop("Packages installed");
      } catch (error) {
        inst.stop(styleText("yellow", "Package install failed"));
        p.log.warn(styleText("yellow", `Install manually: ${pm} add ${plan.npm.join(" ")}`));
        void error;
      }
    } else {
      p.log.info(styleText("dim", `Remember to install: ${plan.npm.join(", ")}`));
    }
  }

  // --- summary
  const summary = [
    added.length && `${styleText("green", "added")}     ${added.join(", ")}`,
    unchanged.length && `${styleText("dim", "unchanged")} ${unchanged.join(", ")}`,
    skipped.length && `${styleText("yellow", "skipped")}   ${skipped.join(", ")}`,
  ].filter(Boolean) as string[];

  if (summary.length) p.note(summary.join("\n"), "Result");

  if (addedItems.length) {
    const imports = addedItems.map((item) => {
      const stmt = item.type === "type" ? "import type" : "import";
      return styleText("dim", `${stmt} { ${item.name} } from '${importAlias(item, config)}';`);
    });
    p.note(imports.join("\n"), "Import");
  }

  p.outro(
    added.length
      ? styleText("cyan", `Done — ${added.length} file${added.length === 1 ? "" : "s"} written.`)
      : styleText("dim", "No files changed."),
  );
}
