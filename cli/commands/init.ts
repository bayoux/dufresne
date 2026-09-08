import fs from "node:fs";
import path from "node:path";
import { styleText } from "node:util";

import * as p from "@clack/prompts";

import { CONFIG_FILE, DEFAULT_CONFIG, findConfig, writeConfig } from "../core/config.ts";
import type { CaseStyle, Config } from "../types.ts";

export async function init(): Promise<void> {
  p.intro(`${styleText(["bgCyan", "black"], " dufresne init ")}`);

  const cwd = process.cwd();
  const tsDefault = fs.existsSync(path.join(cwd, "tsconfig.json"));
  if (findConfig(cwd)) {
    const overwrite = await p.confirm({
      message: `${CONFIG_FILE} already exists. Recreate it?`,
      initialValue: false,
    });
    if (p.isCancel(overwrite) || !overwrite) {
      p.outro(styleText("dim", "Kept existing config."));
      return;
    }
  }

  const answers = await p.group(
    {
      ts: () => p.confirm({ message: "Use TypeScript?", initialValue: tsDefault }),
      utilsPath: () =>
        p.text({
          message: "Where should utils be written?",
          placeholder: DEFAULT_CONFIG.paths.utils,
          defaultValue: DEFAULT_CONFIG.paths.utils,
        }),
      utilsAlias: () =>
        p.text({
          message: "Import alias for utils?",
          placeholder: DEFAULT_CONFIG.aliases.utils,
          defaultValue: DEFAULT_CONFIG.aliases.utils,
        }),
      helpersPath: () =>
        p.text({
          message: "Where should helpers be written?",
          placeholder: DEFAULT_CONFIG.paths.helpers,
          defaultValue: DEFAULT_CONFIG.paths.helpers,
        }),
      helpersAlias: () =>
        p.text({
          message: "Import alias for helpers?",
          placeholder: DEFAULT_CONFIG.aliases.helpers,
          defaultValue: DEFAULT_CONFIG.aliases.helpers,
        }),
      caseStyle: () =>
        p.select({
          message: "Filename casing?",
          options: [
            { value: "kebab", label: "kebab-case (deep-merge.ts)" },
            { value: "camel", label: "camelCase (deepMerge.ts)" },
          ],
          initialValue: DEFAULT_CONFIG.case,
        }),
      barrel: () =>
        p.confirm({ message: "Maintain an index barrel file?", initialValue: DEFAULT_CONFIG.barrel }),
    },
    {
      onCancel: () => {
        p.cancel("Cancelled.");
        process.exit(0);
      },
    },
  );

  const config: Config = {
    ts: answers.ts,
    case: answers.caseStyle as CaseStyle,
    barrel: answers.barrel,
    aliases: { utils: answers.utilsAlias, helpers: answers.helpersAlias },
    paths: { utils: answers.utilsPath, helpers: answers.helpersPath },
  };

  const file = writeConfig(cwd, config);
  p.note(styleText("dim", file), styleText("green", `Created ${CONFIG_FILE}`));
  p.outro(styleText("cyan", "Run `dufresne add` to pull in items."));
}
