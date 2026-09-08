import type { CaseStyle } from "../types.ts";

export function toKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

export function toCamel(name: string): string {
  return name
    .replace(/[-_\s]+(.)?/g, (_, c: string | undefined) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (m) => m.toLowerCase());
}

export function applyCase(name: string, style: CaseStyle): string {
  return style === "camel" ? toCamel(name) : toKebab(name);
}
