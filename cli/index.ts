#!/usr/bin/env node
import { parseArgs, styleText } from "node:util";

import { add } from "./commands/add.ts";
import { info } from "./commands/info.ts";
import { init } from "./commands/init.ts";
import { list } from "./commands/list.ts";
import { remove } from "./commands/remove.ts";
import { sync } from "./commands/sync.ts";
import { update } from "./commands/update.ts";

const VERSION = process.env.VERSION ?? "dev";

const HELP = `${styleText("cyan", "dufresne")} — fast CLI for import utils

${styleText("bold", "Usage")}
  dufresne <command> [items...] [options]

${styleText("bold", "Commands")}
  init              Create a dufresne.json (pre-filled from your tsconfig paths)
  add [items...]    Add items (and their dependencies) to your project
  update [items...] Re-sync installed items whose upstream source changed
  remove [items...] Delete installed item(s) and their barrel export
  sync              Install exactly the set recorded in dufresne.json's "items"
  list [query]      Display available items, optionally filtered
  info [name]       Show an item's description, deps and examples

${styleText("bold", "Options")}
  -a, --all           add/update: select every item
  -o, --overwrite     add/sync: overwrite existing files without asking
  -y, --yes           add/update/remove/sync: skip every confirmation
      --dry-run       add: print the install plan, write nothing
      --jsdoc         add/update/sync: keep JSDoc comments in added files
      --no-jsdoc      add/update/sync: strip JSDoc comments from added files
      --category <c>  list: only items in this category
      --tag <t>       list: only items with this tag
      --json          list/info: machine-readable output, no prompts
      --cwd <dir>     target project directory (default: .)
      --registry <s>  URL or local path of the registry to use
  -h, --help          Show this help
  -v, --version       Show version
`;

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      all: { type: "boolean", short: "a", default: false },
      overwrite: { type: "boolean", short: "o", default: false },
      yes: { type: "boolean", short: "y", default: false },
      "dry-run": { type: "boolean", default: false },
      jsdoc: { type: "boolean", default: false },
      "no-jsdoc": { type: "boolean", default: false },
      category: { type: "string" },
      tag: { type: "string" },
      json: { type: "boolean", default: false },
      cwd: { type: "string" },
      registry: { type: "string" },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
    },
  });

  const [command, ...items] = positionals;

  if (values.version) {
    console.log(VERSION);
    return;
  }
  if (values.help || !command) {
    console.log(HELP);
    return;
  }

  const jsdoc = values.jsdoc ? true : values["no-jsdoc"] ? false : undefined;

  switch (command) {
    case "init":
      await init();
      break;
    case "add":
      await add(items, {
        all: values.all,
        overwrite: values.overwrite,
        yes: values.yes,
        dryRun: values["dry-run"],
        registry: values.registry,
        cwd: values.cwd,
        jsdoc,
      });
      break;
    case "update":
      await update(items, {
        all: values.all,
        yes: values.yes,
        registry: values.registry,
        cwd: values.cwd,
        jsdoc,
      });
      break;
    case "remove":
      await remove(items, {
        yes: values.yes,
        registry: values.registry,
        cwd: values.cwd,
      });
      break;
    case "sync":
      await sync({
        yes: values.yes,
        overwrite: values.overwrite,
        registry: values.registry,
        cwd: values.cwd,
        jsdoc,
      });
      break;
    case "list":
      await list(values.registry, {
        query: items[0],
        category: values.category,
        tag: values.tag,
        json: values.json,
      });
      break;
    case "info":
      await info(items[0], values.registry, values.json);
      break;
    default:
      console.error(styleText("red", `Unknown command: ${command}`));
      console.log(HELP);
      process.exitCode = 1;
  }
}

main();
