# Architecture

`dufresne` is a "copy the source, don't install the package" distributor for
utility functions — the shadcn model, applied to plain TS utilities. It has two
halves that ship together but live apart:

| Half        | Location                | Published as        |
| ----------- | ----------------------- | ------------------- |
| The catalog | `src/`                  | raw files on GitHub |
| The CLI     | `cli/` (bundled → `dist/`) | npm package `dufresne` |

`registry.json` is the contract between them: the CLI reads it, then fetches the
raw source files it points at.

## Layout

```
src/
  utils/<name>/<name>.ts        # the utility (single implementation file)
  utils/<name>/<name>.test.ts   # co-located test
  helpers/<name>/<name>.ts      # standalone algorithms, data structures, patterns
                                 # (camelCase fn or PascalCase class per <name>)
  types/<name>/<name>.ts        # pure TS types (interfaces/type aliases, no runtime code)
cli/
  index.ts                     # bin entry: Node-version guard, then dynamically
                                # imports main.ts (see "Node version guard" below)
  main.ts                      # arg parsing + command dispatch
  commands/{add,update,remove,sync,list,init,info,doctor}.ts  # one file per command
  core/
    http.ts                     # registry + file fetching (parallel in `add`/`update`)
    registry.ts                 # resolveDependencies() — the graph walk
    config.ts                   # dufresne.json read/write/normalize + detectedConfig()
    detect.ts                   # read the consumer's tsconfig/jsconfig path aliases
    installer.ts                # path resolution, import rewriting, barrel file,
                                 # importAlias(), removeItemFile()/removeFromBarrel()
    pm.ts                       # package-manager detection + install
  lib/
    metadata.ts                 # JSDoc parsing + extractDependencies() + hashing
    transform.ts                # stripJsdoc() — drop the JSDoc header on request
    doctest.ts                  # extractDoctestPairs() — turns `@example` into checkable pairs
    suggest.ts                  # levenshtein-based "did you mean" for typo'd names
    cases.ts                    # kebab/camel filename casing
  types.ts                      # Registry / RegistryItem / Config
scripts/
  build-registry.ts             # scans src/, writes registry.json
  new-item.ts                   # maintainer-only scaffolder (`pnpm new <Name>`), not shipped
  verify-examples.test.ts       # runs runnable `@example`s as node:test cases
  cli-integration.test.ts       # spawns cli/index.ts as a subprocess per command
```

## Adding an item

`pnpm new <Name>` ([scripts/new-item.ts](scripts/new-item.ts)) scaffolds steps 1
and 2 below interactively (kind, description, category, tags, usage) and stops
short of the implementation — fill in the `TODO`. Manually:

1. `mkdir src/utils/<name>` and add `<name>.ts` with a structured JSDoc header:

   ```ts
   /**
    * @name <name>              // must equal the folder name
    * @description One line, shown in `dufresne list`.  (required)
    * @category array
    * @tags array, transform
    * @usage low | medium | high
    *
    * @example
    * name(1, 2); // 3
    */
   export function name() {}
   ```

   Write the `@example` as `expr; // expected` (or the statement on one line,
   `// expected` on the next) when you can — `pnpm test` runs it for real via
   `scripts/verify-examples.test.ts` and fails if it's wrong. Anything else
   (prose, a side-effecting snippet, a type-level example) is left alone; it's
   only ever documentation.

2. Add `<name>.test.ts` next to it. **Required** — the registry build fails
   without it. A pure-type item (no runtime code) still gets one: assign a
   value to the type and assert on that value — it doubles as a compile-time
   check (`pnpm lint` fails if the type is wrong) and a real, if trivial,
   runtime test.
3. `pnpm registry` regenerates `registry.json`.

Pure TypeScript utility types (`DeepPartial`, `Prettify`, …) get their own
`ItemType` — `"type"` — and their own folder, `src/types/<name>/`, install
path (`paths.types`), import alias (`aliases.types`), and `#types/<name>`
import prefix. They're kept out of `utils/` on purpose: a consumer without
TypeScript can't use them at all, and a type has no runtime footprint to mix
with actual function calls. `targetInfo()` forces `.ts` for a type item
regardless of the consumer's `ts` setting (there's no other sensible
representation), and `appendBarrel()` emits `export type * from …` for them
instead of a plain `export *`.

That's it — no central index to edit. `pnpm test` picks the test up
automatically (`node --test` globs `**/*.test.ts`).

### Registry validation

`scripts/build-registry.ts` refuses to write the registry (exit 1) if any item:
lacks a JSDoc block, lacks `@description`, has an `@name` that disagrees with its
folder, or has no `<name>.test.ts`. `pnpm check` runs lint + tests +
`check:registry` (regenerate and `git diff --exit-code` — catches a stale
committed `registry.json`); CI runs it before publishing.

## Dependencies between items

Import another catalog item by alias — **never** by relative path:

```ts
import { compact } from "#utils/compact/compact";
import { toArray } from "#helpers/to-array/to-array";
import type { Prettify } from "#types/Prettify/Prettify";
```

This actually resolves — at both `tsc` and plain `node`/`node --test` — via
[package.json](package.json)'s `imports` field:

```json
"imports": {
  "#utils/*": "./src/utils/*.ts",
  "#helpers/*": "./src/helpers/*.ts",
  "#types/*": "./src/types/*.ts"
}
```

`#`-prefixed subpath imports are a native Node feature (not a bundler-only
convention), and TypeScript's `nodenext` module resolution (already this
repo's setting) reads the same field the same way — so there's one source of
truth instead of a `tsconfig.json` `paths` block that only `tsc` understood.
`*` captures the whole rest of the specifier including the extra `/<name>`,
which is exactly what the folder-per-item doubling needs: `#utils/uniq/uniq`
→ `./src/utils/uniq/uniq.ts`. [sample.ts](src/utils/sample/sample.ts) →
`shuffle` and [lcm.ts](src/helpers/lcm/lcm.ts) → `gcd` are real examples —
`dufresne info sample` shows `shuffle` as a dependency, and `dufresne add
sample` installs both.

(`#` also sidesteps a small ambiguity `@` had: a real scoped npm import like
`@clack/prompts` and an internal ref both started with `@`, so the internal
check had to run first. `extractDependencies()` no longer needs that care.)

`extractDependencies()` ([cli/lib/metadata.ts](cli/lib/metadata.ts)) reads
these at registry-build time:

- `#utils/*` / `#helpers/*` / `#types/*` → `dependencies.internal` (other
  registry items)
- any other bare specifier (not `node:`, not `react`) → `dependencies.npm`

At `add` time, `resolveDependencies()` ([cli/core/registry.ts](cli/core/registry.ts))
walks that graph: it pulls in transitive `internal` items in topological order
(deps first), unions every `npm` package, and errors on a missing item or a
cycle. `installer.rewriteImports()` then rewrites the `#…` specifiers to the
consumer's configured aliases (still whatever their own project uses, e.g.
`@/utils/*` — the `#` convention is purely internal to this repo) so the
copied file compiles in their project.

## Consumer config — `dufresne.json`

`dufresne init` writes it; `dufresne add` reads it. It controls where files land
and how imports are rewritten:

```jsonc
{
  "ts": true,
  "case": "kebab",                              // deep-merge.ts vs deepMerge.ts
  "barrel": true,                               // maintain index.ts re-exports
  "comments": true,                             // keep the JSDoc header (false = stripJsdoc)
  "items": ["chunk", "clamp"],                  // declared set; see below
  "aliases": { "utils": "@/utils", "helpers": "@/helpers", "types": "@/types" },
  "paths":   { "utils": "src/utils", "helpers": "src/helpers", "types": "src/types" }
}
```

When there is no `dufresne.json`, `detectedConfig()` ([cli/core/config.ts](cli/core/config.ts))
overlays `DEFAULT_CONFIG` with whatever `detectProject()`
([cli/core/detect.ts](cli/core/detect.ts)) can read from the consumer's
`tsconfig.json` / `jsconfig.json`: it takes `compilerOptions.paths`, prefers an
alias that already names a kind (`…/utils`, `…/lib`, `…/types`), and otherwise
derives one from a catch-all like `@/*` → `src/*`. `init` seeds every prompt from
the same detection, so the common case is a single Enter-through.

### `items` — the declared set, `remove` and `sync`

`Config.items` is the only field `add`/`remove` write back on their own: a
successful `add` unions the names it just wrote into it (only when
`dufresne.json` already exists — a bare `detectedConfig()` fallback has
nothing to write into), and `remove` drops them again. It's deliberately not
called a lockfile — there's no hash pinning, just "what this project has
declared it wants."

- [cli/commands/remove.ts](cli/commands/remove.ts) is `add`'s inverse:
  `removeItemFile()` + `removeFromBarrel()` ([cli/core/installer.ts](cli/core/installer.ts)),
  npm packages are reported but never touched (something else installed might
  still need them).
- [cli/commands/sync.ts](cli/commands/sync.ts) is a thin wrapper —
  `add(config.items, options)` — that turns the declared set back into files.
  It's additive only: dropping a name from `items` and running `sync` does not
  delete the corresponding file; use `remove` for that.

## Fuzzy names

Every command that takes an item name runs it past the registry first; an
unknown name gets a suggestion from [cli/lib/suggest.ts](cli/lib/suggest.ts)
(edit distance, with a substring-match bonus) instead of a hard stop, and
`add`/`update` carry on with whatever names *did* resolve rather than aborting
the whole batch over one typo.

## Node version guard

[cli/index.ts](cli/index.ts) is intentionally the only file in this repo with
zero imports besides bare Node globals. It checks `process.versions.node`
against `engines.node` in [package.json](package.json) and, if too old, prints
a plain-English message and exits — *before* [cli/main.ts](cli/main.ts) (and
everything it pulls in, starting with `node:util`'s `styleText`/`parseArgs`,
unavailable pre-22.13) ever loads. That "before" only holds because the load
is a dynamic `await import("./main.ts")`: a static `import` at the top of a
module is hoisted and evaluated by the language regardless of where it's
written in the file, version check or not, so it wouldn't guard anything.

This survives bundling, checked empirically, not assumed: `tsdown` (rolldown)
treats the dynamic import as a real code-splitting boundary, so `pnpm build`
emits `dist/index.js` (just the guard — no `node:util`, nothing else) plus a
separate `dist/main-*.js` chunk for the rest, and `npm pack` ships both
(`files: ["dist"]` covers the whole directory, hashed chunk name included).

## Scaling notes

- **Command orchestration is tested end-to-end, not just its pieces.**
  `cli/core`/`cli/lib` are unit-tested, but `cli/commands/*.ts` — the actual
  `add`/`update`/`remove`/`sync` logic — only got manual, throwaway smoke
  testing for a long time. [scripts/cli-integration.test.ts](scripts/cli-integration.test.ts)
  closes that: it spawns `cli/index.ts` as a real subprocess per test, against
  a fresh temp dir and this repo's own `registry.json` (a local path, so it's
  offline and immune to upstream drift), and asserts on files/exit
  codes/stdout — including the dependency pull-in (`add sample` also writes
  `shuffle`) and the modify → `update` → restored round trip. Auto-discovered
  by bare `pnpm test`, same as `verify-examples.test.ts`.
- **Flat is fine.** One folder per item keeps the tree navigable into the
  hundreds without a manifest to hand-maintain.
- **The registry is a map** (`items: Record<name, …>`), so lookup and
  "add everything" (`--all`) are trivial.
- **`dufresne update`** ([cli/commands/update.ts](cli/commands/update.ts)) closes
  the loop the `hash` field was left for: it re-derives what `add` would write
  today for every *installed* item (existence on disk is the only signal it
  needs — no lockfile) and diffs it against what's on disk, byte for byte. No
  drift tracking beyond that — like `add`'s own unchanged-check, it can't tell
  "you edited this" from "upstream changed"; both just show as different.
- **`@example` blocks** are parsed into `RegistryItem.examples`, shown by
  `dufresne info <name>` (also as `--json`), and — where they're precise
  enough (`expr; // expected`) — run for real by
  [scripts/verify-examples.test.ts](scripts/verify-examples.test.ts) via
  `pnpm test`: it dynamically imports the real source, evaluates `expr` with
  the exported function bound in scope, and asserts against `expected`.
  Anything it can't safely evaluate is `t.skip()`ped, never failed — the goal
  is zero false positives, not 100% coverage of every example. A richer
  "docs" surface could still pull the public type signature via the TS
  compiler API (reactuse does this for its docs site).
- **`helper` scope.** Originally meant only as "shared building blocks utils
  depend on" (still unused for that — see the cross-import gap above), it now
  also covers standalone algorithms/data-structures/patterns consumers `add`
  directly. Either casing is valid for `<name>`: camelCase for a function
  (`binarySearch`), PascalCase for a class (`LRUCache`) — `pnpm new` picks the
  right template from the casing. `toKebab()` ([cli/lib/cases.ts](cli/lib/cases.ts))
  handles acronym-style names correctly (`LRUCache` → `lru-cache`, not
  `lrucache`) via a dedicated acronym-boundary pass before the usual
  camelCase-boundary one.
- **`util` / `helper` / `type`** cover the current kinds; a fourth would
  follow the same recipe: a folder in `TYPE_DIRS`
  ([scripts/build-registry.ts](scripts/build-registry.ts)), a `paths`/`aliases`
  key on `Config`, and a case in `installer.targetInfo()`'s `PATH_KEY` map.
- **`list`/`info --json`** skip clack entirely (no ANSI, no prompts) so
  scripts and editor tooling can consume the same registry data the
  interactive commands use — `list --category`/`--tag`/a free-text query
  filter the same `RegistryItem[]` before either output path renders it.
