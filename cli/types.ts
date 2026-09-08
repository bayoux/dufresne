export type ItemType = "util" | "helper" | "type";

export type CaseStyle = "kebab" | "camel";

/** How commonly an item is expected to be reached for (`@usage` tag). */
export type Usage = "low" | "medium" | "high";

/** One entry in the published registry. */
export interface RegistryItem {
  id: string;
  type: ItemType;
  /** Bare item name, also the registry key (e.g. `intersection`). */
  name: string;
  /** Path relative to `Registry.baseUrl` (e.g. `utils/intersection/intersection.ts`). */
  file: string;
  description: string;
  category: string;
  tags: string[];
  usage?: Usage;
  /** `@example` blocks pulled from the JSDoc header. */
  examples: string[];
  /** sha256 of the source file — used to detect drift on `update`. */
  hash: string;
  dependencies: {
    /** npm packages the source imports. */
    npm: string[];
    /** Other registry item names the source imports via `#utils/*`, `#helpers/*` or `#types/*`. */
    internal: string[];
  };
}

export interface Registry {
  schemaVersion: "2";
  /** Raw base URL that `file` paths are resolved against. */
  baseUrl: string;
  /** Keyed by item name for O(1) lookup. */
  items: Record<string, RegistryItem>;
}

/** Consumer-project settings, read from `dufresne.json` at the project root. */
export interface Config {
  /** Emit TypeScript (`true`) or JavaScript (`false`). */
  ts: boolean;
  /** Filename casing for installed files. */
  case: CaseStyle;
  /** Append `export * from ...` to an `index` barrel in the target dir. */
  barrel: boolean;
  /** Keep the JSDoc header/comments in added files (`false` strips them). */
  comments: boolean;
  /** Import specifiers that `#utils/*`, `#helpers/*` and `#types/*` are rewritten to. */
  aliases: { utils: string; helpers: string; types: string };
  /** On-disk destinations, relative to the project root. */
  paths: { utils: string; helpers: string; types: string };
  /**
   * The declared set of items this project depends on. `add` appends to it
   * (when `dufresne.json` exists); `dufresne sync` installs exactly this set.
   */
  items: string[];
}
