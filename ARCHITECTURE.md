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
cli/
  index.ts                      # arg parsing + command dispatch
  commands/{add,list,init}.ts   # one file per command
  core/
    http.ts                     # registry + file fetching
    registry.ts                 # resolveDependencies() — the graph walk
    config.ts                   # dufresne.json read/write/normalize
    installer.ts                # path resolution, import rewriting, barrel file
    pm.ts                       # package-manager detection + install
  lib/
    metadata.ts                 # JSDoc parsing + extractDependencies() + hashing
    cases.ts                    # kebab/camel filename casing
  types.ts                      # Registry / RegistryItem / Config
scripts/
  build-registry.ts             # scans src/, writes registry.json
```

## Adding an item

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
    * name(...);  // -> ...
    */
   export function name() {}
   ```

2. Add `<name>.test.ts` next to it. **Required** — the registry build fails
   without it.
3. `pnpm registry` regenerates `registry.json`.

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
```

`extractDependencies()` ([cli/lib/metadata.ts](cli/lib/metadata.ts)) reads these
at registry-build time:

- `@/utils/*` / `@/helpers/*` → `dependencies.internal` (other registry items)
- any other bare specifier (not `node:`, not `react`) → `dependencies.npm`

At `add` time, `resolveDependencies()` ([cli/core/registry.ts](cli/core/registry.ts))
walks that graph: it pulls in transitive `internal` items in topological order
(deps first), unions every `npm` package, and errors on a missing item or a
cycle. `installer.rewriteImports()` then rewrites the `@/…` specifiers to the
consumer's configured aliases so the copied file compiles in their project.

## Consumer config — `dufresne.json`

`dufresne init` writes it; `dufresne add` reads it (falling back to
`DEFAULT_CONFIG`). It controls where files land and how imports are rewritten:

```jsonc
{
  "ts": true,
  "case": "kebab",                              // deep-merge.ts vs deepMerge.ts
  "barrel": true,                               // maintain index.ts re-exports
  "aliases": { "utils": "@/utils", "helpers": "@/lib" },
  "paths":   { "utils": "src/utils", "helpers": "src/lib" }
}
```

## Scaling notes

- **Flat is fine.** One folder per item keeps the tree navigable into the
  hundreds without a manifest to hand-maintain.
- **The registry is a map** (`items: Record<name, …>`), so lookup and
  "add everything" (`--all`) are trivial.
- **`hash`** (sha256 of each source file) is already in every entry — it's the
  hook for a future `dufresne update` that diffs installed files against the
  registry.
- **`@example` blocks** are parsed into `RegistryItem.examples` and shown by
  `dufresne info <name>`; that command is the whole "docs" surface for now. A
  richer version could pull the public type signature via the TS compiler API
  (reactuse does this for its docs site).
- **`helper` vs `util`** is the only type axis; add another top-level folder in
  `TYPE_DIRS` ([scripts/build-registry.ts](scripts/build-registry.ts)) and a
  matching `paths`/`aliases` key to introduce a third kind.
