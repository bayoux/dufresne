import type { CaseStyle } from "../types.ts";

export function toKebab(name: string): string {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2") // acronym boundary: LRUCache -> LRU-Cache
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // camelCase boundary: fooBar -> foo-Bar
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
