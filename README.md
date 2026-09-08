# dufresne

Fast CLI for import utils — copy small, dependency-free TypeScript utilities
straight into your project instead of installing a package for them. Same idea
as shadcn/ui, applied to plain functions.

```bash
npx dufresne add intersection
```

That downloads `intersection.ts` into `./utils` and wires up an `index.ts`
barrel export — no runtime dependency added to your project.

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
| `--cwd <dir>` | target project directory (default: `.`) |
| `--registry <url\|path>` | use a different registry (a local path also reads sources from its sibling `src/`) |

Run `dufresne --help` for the full list.

## Configuration

`dufresne init` writes `dufresne.json` to the project root. `add` reads it to
decide where files go and how imports are rewritten; without one it falls back
to sane defaults (`./utils`, `./lib`, `./types`).

```jsonc
{
  "ts": true,
  "case": "kebab",                                // deep-merge.ts vs deepMerge.ts
  "barrel": true,                                  // maintain an index.ts re-export
  "aliases": { "utils": "@/utils", "helpers": "@/lib", "types": "@/types" },
  "paths":   { "utils": "src/utils", "helpers": "src/lib", "types": "src/types" }
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
