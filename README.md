# dufresne

Fast CLI for import utils — copy small, dependency-free TypeScript utilities
straight into your project instead of installing a package for them. Same idea
as shadcn/ui, applied to plain functions.

```bash
npx dufresne add intersection
```

That downloads `intersection.ts` into your utils folder (detected from your
`tsconfig.json` paths, e.g. `src/utils`) and wires up an `index.ts` barrel
export — no runtime dependency added to your project.

## Why

- **You own the code.** It lands in your repo as a normal file, ready to read,
  tweak, or delete.
- **Zero bloat.** No package in `node_modules`, no version to track — unless
  the utility itself needs one, in which case `add` installs it for you.
- **Dependencies resolve automatically.** If a utility imports another catalog
  item, that item is pulled in too.

## Commands

```bash
npx dufresne init             # create dufresne.json for this project
npx dufresne list             # show every available item
npx dufresne info <name>      # description, deps, examples for one item
npx dufresne add [items...]   # add items (interactive picker if none given)
```

### `add` options

| Flag | Description |
| --- | --- |
| `-a, --all` | add every item in the registry |
| `-o, --overwrite` | overwrite existing files without asking |
| `--jsdoc` / `--no-jsdoc` | force-keep or strip the JSDoc header in added files (default: follow config) |
| `--cwd <dir>` | target project directory (default: `.`) |
| `--registry <url\|path>` | use a different registry (a local path also reads sources from its sibling `src/`) |

The picker is a type-to-filter search (`dufresne add` with no arguments), sources
are fetched in parallel, and a file whose content already matches is reported as
`unchanged` instead of prompting. Run `dufresne --help` for the full list.

## Configuration

`dufresne init` writes `dufresne.json` to the project root, **pre-filling every
answer from your own `tsconfig.json` / `jsconfig.json` path aliases**. `add`
reads that file to decide where code goes and how imports are rewritten; without
one it applies the same detection on the fly (so `@/*` → `src/*` projects get
`@/utils` → `src/utils` for free) and falls back to `./utils`, `./helpers`,
`./types` only when nothing is detected.

```jsonc
{
  "ts": true,
  "case": "kebab",                                // deep-merge.ts vs deepMerge.ts
  "barrel": true,                                  // maintain an index.ts re-export
  "comments": true,                                // keep the JSDoc header (false strips it)
  "aliases": { "utils": "@/utils", "helpers": "@/helpers", "types": "@/types" },
  "paths":   { "utils": "src/utils", "helpers": "src/helpers", "types": "src/types" }
}
```

Utils and helpers install as regular code; type-only items (see below) get
their own `types` path/alias and are always written as `.ts`, since a type has
no JavaScript form.

## Available utilities

Run `dufresne list` for the live, up-to-date catalog. Every item ships with a
JSDoc header (`dufresne info <name>` prints it), a co-located test, and an
explicit dependency graph.

| Name | Category | Description |
| --- | --- | --- |
| `intersection` | array | Values common to every passed array |
| `pull` | array | Removes every occurrence of the given values |
| `chunk` | array | Splits an array into chunks of a given size |
| `groupBy` | array | Groups items into a record keyed by a selector |
| `clamp` | number | Restricts a number to an inclusive range |
| `debounce` | function | Wraps a function to only run after N ms of silence |
| `sleep` | async | Promise that resolves after a delay |
| `DeepPartial` | types | Recursively makes every property optional |
| `Prettify` | types | Flattens an intersection type for cleaner hovers |
| `PartialBy` | types | Makes the given keys of a type optional |

## Development

Requires Node ≥ 22.18 (native TypeScript execution, no transpile step needed
locally).

```bash
pnpm install
pnpm start        # run the CLI from source: node cli/index.ts
pnpm dev          # same, with --watch
pnpm registry     # regenerate registry.json from src/
pnpm check        # lint + test + verify registry.json is up to date
pnpm build        # registry + tsdown bundle -> dist/
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the repo layout, the registry
format, and the conventions for adding a new utility.

## License

MIT
