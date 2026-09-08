import { createHash } from "node:crypto";
import { builtinModules } from "node:module";

export type Usage = "low" | "medium" | "high";

export interface ParsedMetadata {
  /** `@name` — canonical item name; should match the folder. */
  name: string | undefined;
  description: string;
  tags: string[];
  category: string;
  usage: Usage | undefined;
  /** Each `@example` block, verbatim. */
  examples: string[];
}

const JSDOC_RE = /\/\*\*[ \t]*\r?\n[\s\S]*?\*\//;

/** Returns the file's leading JSDoc block (like reactuse's matchJsdoc). */
export function matchJsdoc(content: string): string | undefined {
  return content.match(JSDOC_RE)?.[0].trim();
}

function stripStars(block: string): string {
  return block
    .replace(/^\/\*\*/, "")
    .replace(/\*\/$/, "")
    .split("\n")
    .map((line) => line.replace(/^\s*\*?[ \t]?/, ""))
    .join("\n")
    .trim();
}

/** Parses the structured JSDoc header an item file is expected to carry. */
export function parseMetadata(content: string, relativePath: string): ParsedMetadata {
  const block = matchJsdoc(content);
  const doc = block ? stripStars(block) : "";

  const tag = (name: string) => doc.match(new RegExp(`@${name}[ \\t]+(.*)`))?.[1]?.trim();

  const description = tag("description")?.replace(/^-\s*/, "") ?? "";
  const name = tag("name");
  const category = tag("category") || relativePath.split("/")[0] || "general";
  const tags =
    tag("tags")
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean) ?? [];

  const rawUsage = tag("usage");
  const usage: Usage | undefined =
    rawUsage === "low" || rawUsage === "medium" || rawUsage === "high" ? rawUsage : undefined;

  const examples = [...doc.matchAll(/@example[ \t]*\r?\n([\s\S]*?)(?=\n@\w|$)/g)]
    .map((m) => m[1]!.trim())
    .filter(Boolean);

  return { name, description, tags, category, usage, examples };
}

const IGNORED_PACKAGES = new Set(["react", "react-dom"]);
const BUILTINS = new Set(builtinModules);

const IMPORT_RE =
  /(?:import|export)\s+(?:type\s+)?(?:[\w*{}\n,\s]+?\s+from\s+)?['"]([^'"]+)['"]/g;

const INTERNAL_PREFIXES = ["#utils/", "#helpers/", "#types/"];

/**
 * Derives an item's dependency graph from its import statements.
 * - `#utils/<name>` / `#helpers/<name>` / `#types/<name>` -> internal registry items
 * - bare specifiers (not `node:`, not ignored) -> npm packages
 * - relative specifiers -> ignored (items must be single-file)
 */
export function extractDependencies(content: string): { npm: string[]; internal: string[] } {
  const npm = new Set<string>();
  const internal = new Set<string>();

  for (const match of content.matchAll(IMPORT_RE)) {
    const spec = match[1]!;

    if (INTERNAL_PREFIXES.some((prefix) => spec.startsWith(prefix))) {
      const name = spec.split("/")[1];
      if (name) internal.add(name);
      continue;
    }

    if (spec.startsWith(".") || spec.startsWith("node:")) continue;

    const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]!;
    if (BUILTINS.has(pkg) || IGNORED_PACKAGES.has(pkg)) continue;
    npm.add(pkg);
  }

  return { npm: [...npm].sort(), internal: [...internal].sort() };
}

export function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}
