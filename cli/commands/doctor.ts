import path from "node:path";
import { styleText } from "node:util";

import * as p from "@clack/prompts";

import { CONFIG_FILE, detectedConfig, findConfig } from "../core/config.ts";
import { fetchRegistry } from "../core/http.ts";
import type { Config } from "../types.ts";

export interface DoctorOptions {
  registry?: string | undefined;
  cwd?: string | undefined;
}

const MIN_NODE = { major: 22, minor: 18 };

function findDuplicateValues(entries: Array<[string, string]>): Array<[string, string, string]> {
  const conflicts: Array<[string, string, string]> = [];

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const [keyA, valueA] = entries[i]!;
      const [keyB, valueB] = entries[j]!;
      if (valueA === valueB) conflicts.push([keyA, keyB, valueA]);
    }
  }

  return conflicts;
}

export async function doctor(options: DoctorOptions): Promise<void> {
  p.intro(styleText(["bgCyan", "black"], " dufresne doctor "));

  const cwd = path.resolve(options.cwd ?? process.cwd());
  let healthy = true;

  // --- Node version
  const [major = 0, minor = 0] = process.versions.node.split(".").map(Number);
  const nodeOk = major > MIN_NODE.major || (major === MIN_NODE.major && minor >= MIN_NODE.minor);
  if (nodeOk) {
    p.log.success(`Node.js ${process.versions.node} (>= ${MIN_NODE.major}.${MIN_NODE.minor} required)`);
  } else {
    p.log.error(
      `Node.js ${process.versions.node} is too old — dufresne needs >= ${MIN_NODE.major}.${MIN_NODE.minor}`,
    );
    healthy = false;
  }

  // --- Registry reachability
  const s = p.spinner();
  s.start("Checking the registry...");
  try {
    const registry = await fetchRegistry(options.registry);
    s.stop(`Registry reachable — ${Object.keys(registry.items).length} items`);
  } catch (error) {
    s.stop(styleText("red", "Registry unreachable"));
    p.log.error(error instanceof Error ? error.message : "Unknown error");
    healthy = false;
  }

  // --- dufresne.json
  let config: Config;
  try {
    const found = findConfig(cwd);
    if (found) {
      p.log.success(`${CONFIG_FILE} found and valid`);
      config = found;
    } else {
      p.log.info(`No ${CONFIG_FILE} here — run \`dufresne init\` to create one (defaults/detection apply until then)`);
      config = detectedConfig(cwd).config;
    }
  } catch (error) {
    p.log.error(`${CONFIG_FILE} is invalid: ${error instanceof Error ? error.message : "Unknown error"}`);
    healthy = false;
    config = detectedConfig(cwd).config;
  }

  // --- alias/path conflicts
  const pathConflicts = findDuplicateValues(Object.entries(config.paths));
  if (pathConflicts.length) {
    for (const [a, b, value] of pathConflicts) {
      p.log.warn(`paths.${a} and paths.${b} both point at "${value}" — installed files may collide`);
    }
  } else {
    p.log.success("No conflicts between paths.utils/helpers/types");
  }

  const aliasConflicts = findDuplicateValues(Object.entries(config.aliases));
  if (aliasConflicts.length) {
    for (const [a, b, value] of aliasConflicts) {
      p.log.warn(`aliases.${a} and aliases.${b} are both "${value}" — rewritten imports may collide`);
    }
  } else {
    p.log.success("No conflicts between aliases.utils/helpers/types");
  }

  p.outro(
    healthy
      ? styleText("cyan", "All good.")
      : styleText("red", "Some checks failed — see above."),
  );

  if (!healthy) process.exit(1);
}
