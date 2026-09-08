# dufresne

[![CI](https://github.com/enqrose/dufresne/actions/workflows/ci.yml/badge.svg)](https://github.com/enqrose/dufresne/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/dufresne.svg)](https://www.npmjs.com/package/dufresne)
[![license: MIT](https://img.shields.io/npm/l/dufresne.svg)](LICENSE)

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
npx dufresne list [query]     # show available items, optionally filtered
npx dufresne info [name]      # description, deps, examples (interactive picker if no name)
npx dufresne add [items...]   # add items (interactive picker if none given)
npx dufresne update [items...] # re-sync installed items whose upstream source changed
npx dufresne remove [items...] # delete installed item(s) and their barrel export
npx dufresne sync             # install exactly what dufresne.json's "items" declares
npx dufresne doctor           # check Node version, registry access, config health
```

A misspelled name gets a "did you mean" instead of a hard failure, on every
command that takes one.

### `add` options

| Flag | Description |
| --- | --- |
| `-a, --all` | add every item in the registry |
| `-o, --overwrite` | overwrite existing files without asking |
| `-y, --yes` | skip every confirmation (overwrite + package install) |
| `--dry-run` | print the install plan (paths, new vs. existing, npm deps) and write nothing |
| `--jsdoc` / `--no-jsdoc` | force-keep or strip the JSDoc header in added files (default: follow config) |
| `--cwd <dir>` | target project directory (default: `.`) |
| `--registry <url\|path>` | use a different registry (a local path also reads sources from its sibling `src/`) |

The picker is a type-to-filter search (`dufresne add` with no arguments), sources
are fetched in parallel, a file whose content already matches is reported as
`unchanged` instead of prompting, and a successful `add` prints the exact import
line for what it just wrote. Run `dufresne --help` for the full list.

### `dufresne update`

`add` never touches a file it already wrote correctly again; `update` is what
re-syncs it once the catalog source changes upstream. It only looks at items
that are actually installed (no lockfile needed — it checks whether each
item's on-disk path exists), diffs each against the registry, and reports
`up to date` or applies the ones that changed:

```bash
npx dufresne update              # check everything installed, pick which diffs to apply
npx dufresne update chunk clamp  # check just these
npx dufresne update --all --yes  # apply every diff without asking (e.g. in CI)
```

### `dufresne remove` and `dufresne sync`

`remove` deletes the file(s) `add` wrote and their barrel export line; it
leaves npm packages alone (something else installed might still need them) and
tells you what they were so you can decide.

`add` records every item it successfully writes into `dufresne.json`'s
`items` list (only when that file already exists — it won't create one for
you). `sync` reads that list back and installs exactly it — the reproducible
side of the same coin, for a fresh clone or CI:

```bash
git clone your-repo && cd your-repo
npx dufresne sync --yes   # reinstalls everything the project declared
```

`sync` is additive: it won't delete a file for an item someone later dropped
from `items` — use `remove` for that (which keeps `items` in sync too).

### `dufresne list` filters

```bash
npx dufresne list array          # substring match on name/description/category/tags
npx dufresne list --category array
npx dufresne list --tag transform
npx dufresne list --json         # machine-readable, no prompts — same for `info <name> --json`
```

## Configuration

`dufresne init` writes `dufresne.json` to the project root, **pre-filling every
answer from your own `tsconfig.json` / `jsconfig.json` path aliases**. `add`
reads that file to decide where code goes and how imports are rewritten; without
one it applies the same detection on the fly (so `@/*` → `src/*` projects get
`@/utils` → `src/utils` for free) and falls back to `./utils`, `./helpers`,
`./types` only when nothing is detected.

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/enqrose/dufresne/main/schema.json",
  "ts": true,
  "case": "kebab",                                // deep-merge.ts vs deepMerge.ts
  "barrel": true,                                  // maintain an index.ts re-export
  "comments": true,                                // keep the JSDoc header (false strips it)
  "items": ["chunk", "clamp"],                     // what `add` has written here; `sync` installs this
  "aliases": { "utils": "@/utils", "helpers": "@/helpers", "types": "@/types" },
  "paths":   { "utils": "src/utils", "helpers": "src/helpers", "types": "src/types" }
}
```

`init` writes the `$schema` line automatically, so editors with a JSON
language server (VS Code out of the box) validate the file and autocomplete
its keys as you type.

Utils and helpers install as regular code; type-only items (see below) get
their own `types` path/alias and are always written as `.ts`, since a type has
no JavaScript form.

## Available utilities

Run `dufresne list` for the live, up-to-date catalog. Every item ships with a
JSDoc header (`dufresne info <name>` prints it), a co-located test, and an
explicit dependency graph. Where an `@example` is precise enough to run
(`expr; // expected`), it's checked by `pnpm test` like any other test — a
wrong example in the docs is a build failure, not just a typo.

90 items: the runtime utils are most of the classic underscore.js set, the
types are most of the well-known "TypeScript utility types" (the type-fest /
utility-types canon), and the helpers are popular algorithms, data structures
and patterns — the ones people reach for or reimplement constantly. All three
skip whatever's already native: native JS methods for the utils,
`structuredClone`/`crypto.randomUUID`/etc. for the helpers, TS's own
`Partial`/`Pick`/`Omit`/`Record`/… for the types.

**array** — `first`, `last`, `initial`, `rest`, `compact`, `uniq`, `union`,
`difference`, `intersection`, `pull`, `chunk`, `range`, `zip`, `zipObject`,
`sample`, `shuffle`

**collection** — `groupBy`, `countBy`, `partition`, `pluck`

**function** — `once`, `after`, `memoize`, `negate`, `partial`, `compose`,
`pipe`, `debounce`, `throttle`

**object** — `pick`, `omit`, `defaults`, `invert`, `isEqual`, `isEmpty`

**utility** — `identity`, `constant`, `noop`, `times`, `random`, `uniqueId`

**string** — `escape`, `unescape`

**number** — `clamp`

**async** — `sleep`

**data-structure** — `Stack`, `Queue`, `LinkedList`, `PriorityQueue`,
`LRUCache`, `Trie`

**algorithm** — `binarySearch`, `quickSort`, `mergeSort`, `bfs`, `dfs`,
`levenshteinDistance`, `gcd`, `lcm`, `isPrime`, `fibonacci`

**pattern** — `EventEmitter`, `retry`, `deepMerge`, `get`, `set`,
`flattenObject`, `unflattenObject`, `StateMachine`

**types** (TS-only, no runtime) — `DeepPartial`, `DeepRequired`, `PartialBy`,
`RequiredBy`, `RequireAtLeastOne`, `Prettify`, `Mutable`, `DeepMutable`,
`DeepReadonly`, `Nullable`, `ValueOf`, `Entries`, `UnionToIntersection`,
`Merge`, `XOR`, `PartialRecord`, `ArrayElement`, `Brand`, `LiteralUnion`,
`JsonValue`, `DistributiveOmit`

## Development

Requires Node ≥ 22.18 (native TypeScript execution, no transpile step needed
locally).

```bash
pnpm install
pnpm start        # run the CLI from source: node cli/index.ts
pnpm dev          # same, with --watch
pnpm new <Name>   # scaffold src/utils|helpers/types/<Name>/ (implementation + test)
pnpm registry     # regenerate registry.json from src/
pnpm check        # lint + test + verify registry.json is up to date
pnpm build        # registry + tsdown bundle -> dist/
npm pack --dry-run # preview exactly what `npm publish` would ship, and its size
```

The published package is ~10kB (~30kB unpacked): no sourcemaps in the bundle
(local dev already runs unbundled source, so nothing is ever debugged through
`dist/`), and `README.md` itself is swapped for a short npm-page version at
pack time (`prepack`/`postpack` in [package.json](package.json) — the repo's
own `README.md` you're reading is unaffected; see
[scripts/pack-readme.ts](scripts/pack-readme.ts)).

See [ARCHITECTURE.md](ARCHITECTURE.md) for the repo layout, the registry
format, and the conventions for adding a new utility.

## License

MIT

---

<sub>*"Get busy living, or get busy dying."* — Andy Dufresne spent nineteen years tunneling through a wall to freedom. This package skips the wall.</sub>
