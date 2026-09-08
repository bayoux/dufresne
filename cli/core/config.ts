import fs from "node:fs";
import path from "node:path";

import type { CaseStyle, Config } from "../types.ts";

export const CONFIG_FILE = "dufresne.json";

export const DEFAULT_CONFIG: Config = {
  ts: true,
  case: "kebab",
  barrel: true,
  aliases: { utils: "./utils", helpers: "./lib" },
  paths: { utils: "utils", helpers: "lib" },
};

export function configPath(cwd: string): string {
  return path.join(cwd, CONFIG_FILE);
}

export function findConfig(cwd: string): Config | null {
  const file = configPath(cwd);
  if (!fs.existsSync(file)) return null;

  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch (error) {
    throw new Error(`Invalid JSON in ${CONFIG_FILE}: ${(error as Error).message}`);
  }
  return normalizeConfig(raw);
}

export function loadConfig(cwd: string): Config {
  return findConfig(cwd) ?? DEFAULT_CONFIG;
}

export function writeConfig(cwd: string, config: Config): string {
  const file = configPath(cwd);
  fs.writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`, "utf-8");
  return file;
}

export function normalizeConfig(raw: unknown): Config {
  if (typeof raw !== "object" || raw === null) {
    throw new Error(`${CONFIG_FILE} must be a JSON object`);
  }
  const r = raw as Record<string, unknown>;
  const aliases = (r.aliases ?? {}) as Record<string, unknown>;
  const paths = (r.paths ?? {}) as Record<string, unknown>;
  const style: CaseStyle = r.case === "camel" ? "camel" : "kebab";

  return {
    ts: r.ts !== false,
    case: style,
    barrel: r.barrel !== false,
    aliases: {
      utils: typeof aliases.utils === "string" ? aliases.utils : DEFAULT_CONFIG.aliases.utils,
      helpers:
        typeof aliases.helpers === "string" ? aliases.helpers : DEFAULT_CONFIG.aliases.helpers,
    },
    paths: {
      utils: typeof paths.utils === "string" ? paths.utils : DEFAULT_CONFIG.paths.utils,
      helpers: typeof paths.helpers === "string" ? paths.helpers : DEFAULT_CONFIG.paths.helpers,
    },
  };
}
