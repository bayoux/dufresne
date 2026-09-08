import fs from "node:fs";
import path from "node:path";
import { styleText } from "node:util";

import * as p from "@clack/prompts";

import { CONFIG_FILE, findConfig, loadConfig } from "../core/config.ts";
import { fetchRegistry, loadItemContent } from "../core/http.ts";
import { appendBarrel, rewriteImports, targetInfo, writeItemFile } from "../core/installer.ts";
import { detectPackageManager, installPackages } from "../core/pm.ts";
import { resolveDependencies } from "../core/registry.ts";

export interface AddOptions {
  overwrite: boolean;
  all: boolean;
  registry?: string | undefined;
  cwd?: string | undefined;
}

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
    p.log.error(styleText("red", error instanceof Error ? error.message : "Unknown error"));
    process.exit(1);
  }

  const allNames = Object.keys(registry.items).sort();
  let selected = options.all ? allNames : names;

  if (!selected.length) {
    const picked = await p.multiselect({
      message: "Which items would you like to add?",
      options: allNames.map((name) => ({
        value: name,
        label: name,
        hint: registry.items[name]!.description,
      })),
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

  let plan;
  try {
    plan = resolveDependencies(registry, selected);
  } catch (error) {
    p.log.error(styleText("red", error instanceof Error ? error.message : "Unknown error"));
    p.outro(styleText("dim", "Check the list with `dufresne list`."));
    process.exit(1);
  }

  if (!findConfig(cwd)) {
    p.log.info(
      styleText("dim", `No ${CONFIG_FILE} found — using defaults. Run \`dufresne init\` to customize.`),
    );
  }
  const config = loadConfig(cwd);

  const extra = plan.items.filter((i) => !selected.includes(i.name));
  if (extra.length) {
    p.log.info(styleText("dim", `Pulling in dependencies: ${extra.map((i) => i.name).join(", ")}`));
  }

  const install = p.spinner();
  install.start("Installing...");
  const installed: string[] = [];

  try {
    for (const item of plan.items) {
      install.message(`Fetching ${item.name}...`);
      const raw = await loadItemContent(registry, item.file, options.registry);
      const content = rewriteImports(raw, config);
      const target = targetInfo(item, config, cwd);

      if (fs.existsSync(target.filePath) && !options.overwrite) {
        install.stop();
        const overwrite = await p.confirm({
          message: `${styleText("bold", `${target.base}${target.ext}`)} exists. ${styleText("yellow", "Overwrite?")}`,
          initialValue: false,
        });
        if (p.isCancel(overwrite) || !overwrite) {
          p.log.warn(styleText("yellow", `Skipped ${item.name}.`));
          install.start("Installing...");
          continue;
        }
        install.start("Installing...");
      }

      writeItemFile(target, content);
      if (config.barrel) appendBarrel(target);
      installed.push(item.name);
    }
    install.stop("Files written");
  } catch (error) {
    install.stop(styleText("red", "Install failed."));
    p.log.error(styleText("red", error instanceof Error ? error.message : "Unknown error"));
    process.exit(1);
  }

  if (plan.npm.length) {
    const pm = detectPackageManager(cwd);
    const proceed = await p.confirm({
      message: `Install ${styleText("bold", plan.npm.join(", "))} with ${styleText("cyan", pm)}?`,
      initialValue: true,
    });
    if (!p.isCancel(proceed) && proceed) {
      try {
        installPackages(pm, plan.npm, cwd);
      } catch (error) {
        p.log.warn(
          styleText("yellow", `Package install failed: ${(error as Error).message}. Install manually.`),
        );
      }
    } else {
      p.log.info(styleText("dim", `Remember to install: ${plan.npm.join(", ")}`));
    }
  }

  if (installed.length) {
    p.note(installed.map((n) => styleText("green", n)).join("\n"), "Added");
    p.outro(styleText("cyan", "Done! Happy coding."));
  } else {
    p.outro(styleText("dim", "No files changed."));
  }
}
