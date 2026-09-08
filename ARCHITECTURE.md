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
  helpers/<name>/<name>.ts      # shared building blocks utils may depend on
  types/<name>/<name>.ts        # pure TS types (interfaces/type aliases, no runtime code)
cli/
  index.ts                                       # arg parsing + command dispatch
  commands/{add,update,remove,sync,list,init,info}.ts  # one file per command
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
path (`paths.types`), import alias (`aliases.types`), and `@/types/<name>`
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
import { compact } from "@/utils/compact/compact";
import { toArray } from "@/helpers/to-array/to-array";
import type { Prettify } from "@/types/Prettify/Prettify";
```

`extractDependencies()` ([cli/lib/metadata.ts](cli/lib/metadata.ts)) reads these
at registry-build time:

- `@/utils/*` / `@/helpers/*` / `@/types/*` → `dependencies.internal` (other
  registry items)
- any other bare specifier (not `node:`, not `react`) → `dependencies.npm`

At `add` time, `resolveDependencies()` ([cli/core/registry.ts](cli/core/registry.ts))
walks that graph: it pulls in transitive `internal` items in topological order
(deps first), unions every `npm` package, and errors on a missing item or a
cycle. `installer.rewriteImports()` then rewrites the `@/…` specifiers to the
consumer's configured aliases so the copied file compiles in their project.

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

## Scaling notes

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
- **`util` / `helper` / `type`** cover the current kinds; a fourth would
  follow the same recipe: a folder in `TYPE_DIRS`
  ([scripts/build-registry.ts](scripts/build-registry.ts)), a `paths`/`aliases`
  key on `Config`, and a case in `installer.targetInfo()`'s `PATH_KEY` map.
- **`list`/`info --json`** skip clack entirely (no ANSI, no prompts) so
  scripts and editor tooling can consume the same registry data the
  interactive commands use — `list --category`/`--tag`/a free-text query
  filter the same `RegistryItem[]` before either output path renders it.
