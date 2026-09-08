import path from "node:path";
import { styleText } from "node:util";

import * as p from "@clack/prompts";

import { add } from "./add.ts";
import { CONFIG_FILE, findConfig } from "../core/config.ts";

export interface SyncOptions {
  yes: boolean;
  overwrite: boolean;
  registry?: string | undefined;
  cwd?: string | undefined;
  jsdoc?: boolean | undefined;
}

/**
 * Installs exactly the set declared in `dufresne.json`'s `items` — the
 * reproducible-install counterpart to `add` recording what it wrote. Additive
 * only: it never removes a file for an item dropped from that list.
 */
export async function sync(options: SyncOptions): Promise<void> {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const config = findConfig(cwd);

  if (!config) {
    p.intro(styleText(["bgCyan", "black"], " dufresne sync "));
    p.outro(styleText("dim", `No ${CONFIG_FILE} here — run \`dufresne init\` (and \`add\`) first.`));
    return;
  }

  if (!config.items.length) {
    p.intro(styleText(["bgCyan", "black"], " dufresne sync "));
    p.outro(
      styleText("dim", `${CONFIG_FILE} has no items yet — \`dufresne add\` records them as you go.`),
    );
    return;
  }

  await add(config.items, {
    all: false,
    overwrite: options.overwrite,
    yes: options.yes,
    dryRun: false,
    registry: options.registry,
    cwd: options.cwd,
    jsdoc: options.jsdoc,
  });
}
