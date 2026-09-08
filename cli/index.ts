#!/usr/bin/env node
import { parseArgs, styleText } from "node:util";

import { add } from "./commands/add.ts";
import { info } from "./commands/info.ts";
import { init } from "./commands/init.ts";
import { list } from "./commands/list.ts";

const VERSION = process.env.VERSION ?? "dev";

const HELP = `${styleText("cyan", "dufresne")} — fast CLI for import utils

${styleText("bold", "Usage")}
  dufresne <command> [items...] [options]

${styleText("bold", "Commands")}
  init              Create a dufresne.json in the current project
  add [items...]    Add items (and their dependencies) to your project
  list              Display all available items
  info <name>       Show an item's description, deps and examples

${styleText("bold", "Options")}
  -a, --all           add: select every item
  -o, --overwrite     add: overwrite existing files without asking
      --cwd <dir>     add: target project directory (default: .)
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

  switch (command) {
    case "init":
      await init();
      break;
    case "add":
      await add(items, {
        all: values.all,
        overwrite: values.overwrite,
        registry: values.registry,
        cwd: values.cwd,
      });
      break;
    case "list":
      await list(values.registry);
      break;
    case "info":
      await info(items[0], values.registry);
      break;
    default:
      console.error(styleText("red", `Unknown command: ${command}`));
      console.log(HELP);
      process.exitCode = 1;
  }
}

main();
