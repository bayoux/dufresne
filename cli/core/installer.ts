import fs from "node:fs";
import path from "node:path";

import { applyCase } from "../lib/cases.ts";
import type { Config, RegistryItem } from "../types.ts";

const ALLOWED_EXT = new Set([".ts", ".tsx", ".js", ".jsx"]);

export interface TargetInfo {
  ext: string;
  base: string;
  dir: string;
  filePath: string;
  barrelPath: string;
}

export function targetInfo(item: RegistryItem, config: Config, cwd: string): TargetInfo {
  const ext = config.ts ? (item.file.endsWith(".tsx") ? ".tsx" : ".ts") : ".js";
  const base = applyCase(item.name, config.case);
  const dir = path.join(cwd, config.paths[item.type === "helper" ? "helpers" : "utils"]);

  return {
    ext,
    base,
    dir,
    filePath: path.join(dir, `${base}${ext}`),
    barrelPath: path.join(dir, `index${config.ts ? ".ts" : ".js"}`),
  };
}

/** Rewrites `@/utils/<name>` / `@/helpers/<name>` imports to the consumer's aliases. */
export function rewriteImports(content: string, config: Config): string {
  return content
    .replace(
      /(['"])@\/utils\/([\w-]+)(?:\/[\w-]+)?\1/g,
      (_m, q: string, name: string) => `${q}${config.aliases.utils}/${applyCase(name, config.case)}${q}`,
    )
    .replace(
      /(['"])@\/helpers\/([\w-]+)(?:\/[\w-]+)?\1/g,
      (_m, q: string, name: string) =>
        `${q}${config.aliases.helpers}/${applyCase(name, config.case)}${q}`,
    );
}

export function assertAllowed(filePath: string): void {
  const ext = path.extname(filePath);
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error(`Forbidden file extension: ${ext || "none"}`);
  }
}

export function writeItemFile(target: TargetInfo, content: string): void {
  assertAllowed(target.filePath);
  fs.mkdirSync(target.dir, { recursive: true });
  fs.writeFileSync(target.filePath, content, { encoding: "utf-8", mode: 0o644 });
}

export function appendBarrel(target: TargetInfo): void {
  const line = `export * from './${target.base}';\n`;

  if (!fs.existsSync(target.barrelPath)) {
    fs.writeFileSync(target.barrelPath, line, "utf-8");
    return;
  }
  const current = fs.readFileSync(target.barrelPath, "utf-8");
  if (!current.includes(`./${target.base}'`)) {
    fs.appendFileSync(target.barrelPath, line, "utf-8");
  }
}
