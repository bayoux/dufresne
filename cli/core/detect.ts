import fs from "node:fs";
import path from "node:path";

import type { Config } from "../types.ts";

export interface Detection {
  /** Which file the aliases were read from, or `null` if none matched. */
  source: string | null;
  aliases: Partial<Config["aliases"]>;
  paths: Partial<Config["paths"]>;
  /** `true`/`false` when a ts/jsconfig settles it, else `undefined`. */
  ts: boolean | undefined;
}

/** Tolerant JSON parse: drops `//` and block comments and trailing commas. */
export function parseJsonc(text: string): unknown {
  let out = "";
  let str: string | null = null;
  let line = false;
  let block = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    const n = text[i + 1];

    if (line) {
      if (c === "\n") {
        line = false;
        out += c;
      }
      continue;
    }
    if (block) {
      if (c === "*" && n === "/") {
        block = false;
        i++;
      }
      continue;
    }
    if (str) {
      out += c;
      if (c === "\\") out += text[++i] ?? "";
      else if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'") {
      str = c;
      out += c;
      continue;
    }
    if (c === "/" && n === "/") {
      line = true;
      i++;
      continue;
    }
    if (c === "/" && n === "*") {
      block = true;
      i++;
      continue;
    }
    out += c;
  }

  return JSON.parse(out.replace(/,(\s*[}\]])/g, "$1"));
}

interface AliasEntry {
  alias: string;
  dir: string;
}

function readAliasFile(cwd: string): { entries: AliasEntry[]; source: string } | null {
  for (const file of ["tsconfig.json", "jsconfig.json"]) {
    const full = path.join(cwd, file);
    if (!fs.existsSync(full)) continue;

    try {
      const json = parseJsonc(fs.readFileSync(full, "utf-8")) as {
        compilerOptions?: { baseUrl?: unknown; paths?: unknown };
      };
      const co = json.compilerOptions ?? {};
      const baseUrl = (typeof co.baseUrl === "string" ? co.baseUrl : ".").replace(/\\/g, "/");
      const paths =
        co.paths && typeof co.paths === "object" ? (co.paths as Record<string, unknown>) : {};

      const entries: AliasEntry[] = [];
      for (const [pattern, targets] of Object.entries(paths)) {
        if (!Array.isArray(targets) || typeof targets[0] !== "string") continue;
        const dir = path.posix
          .join(baseUrl, targets[0].replace(/\/\*$/, ""))
          .replace(/^\.\//, "")
          .replace(/^\.$/, "")
          .replace(/\/$/, "");
        entries.push({ alias: pattern.replace(/\/\*$/, "").replace(/\/$/, ""), dir });
      }
      return { entries, source: file };
    } catch {
      // malformed config — try the next candidate
    }
  }
  return null;
}

const KIND_RE: Record<keyof Config["aliases"], RegExp> = {
  utils: /utils?$/i,
  helpers: /(?:helpers?|lib)$/i,
  types: /types?$/i,
};

/**
 * Best-effort read of the consumer project's own path aliases so `add` and
 * `init` default to conventions the project already uses.
 */
export function detectProject(cwd: string): Detection {
  const hasTs = fs.existsSync(path.join(cwd, "tsconfig.json"));
  const hasJs = fs.existsSync(path.join(cwd, "jsconfig.json"));

  const detection: Detection = {
    source: null,
    aliases: {},
    paths: {},
    ts: hasTs ? true : hasJs ? false : undefined,
  };

  const found = readAliasFile(cwd);
  if (!found || !found.entries.length) return detection;

  detection.source = found.source;
  const { entries } = found;

  // A root wildcard alias like "@" -> "src", "~" -> "", "#" -> "src".
  const root =
    entries.find((e) => /^[@~#$]$/.test(e.alias)) ??
    entries.find((e) => e.dir === "src" || e.dir === "app" || e.dir === "") ??
    entries[0];

  for (const kind of Object.keys(KIND_RE) as Array<keyof Config["aliases"]>) {
    const direct = entries.find((e) => KIND_RE[kind].test(e.alias) || KIND_RE[kind].test(e.dir));
    if (direct) {
      detection.aliases[kind] = direct.alias;
      detection.paths[kind] = direct.dir || kind;
      continue;
    }
    if (root) {
      detection.aliases[kind] = `${root.alias}/${kind}`;
      detection.paths[kind] = root.dir ? `${root.dir}/${kind}` : kind;
    }
  }

  return detection;
}
