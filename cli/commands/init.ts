import { styleText } from "node:util";

import * as p from "@clack/prompts";

import { CONFIG_FILE, detectedConfig, findConfig, writeConfig } from "../core/config.ts";
import type { CaseStyle, Config } from "../types.ts";

export async function init(): Promise<void> {
  p.intro(`${styleText(["bgCyan", "black"], " dufresne init ")}`);

  const cwd = process.cwd();

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

  // Pre-fill every answer from the project's own ts/jsconfig where possible.
  const { config: base, detection } = detectedConfig(cwd);
  if (detection.source) {
    p.log.info(styleText("dim", `Detected path aliases from ${detection.source}.`));
  }

  const ask = (message: string, value: string) =>
    p.text({ message, initialValue: value, defaultValue: value, placeholder: value });

  const answers = await p.group(
    {
      ts: () => p.confirm({ message: "Use TypeScript?", initialValue: base.ts }),
      utilsPath: () => ask("Where should utils be written?", base.paths.utils),
      utilsAlias: () => ask("Import alias for utils?", base.aliases.utils),
      helpersPath: () => ask("Where should helpers be written?", base.paths.helpers),
      helpersAlias: () => ask("Import alias for helpers?", base.aliases.helpers),
      typesPath: () => ask("Where should type-only utilities be written?", base.paths.types),
      typesAlias: () => ask("Import alias for type-only utilities?", base.aliases.types),
      caseStyle: () =>
        p.select({
          message: "Filename casing?",
          options: [
            { value: "kebab", label: "kebab-case (deep-merge.ts)" },
            { value: "camel", label: "camelCase (deepMerge.ts)" },
          ],
          initialValue: base.case,
        }),
      barrel: () =>
        p.confirm({ message: "Maintain an index barrel file?", initialValue: base.barrel }),
      comments: () =>
        p.confirm({ message: "Keep JSDoc comments in added files?", initialValue: base.comments }),
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
    comments: answers.comments,
    aliases: { utils: answers.utilsAlias, helpers: answers.helpersAlias, types: answers.typesAlias },
    paths: { utils: answers.utilsPath, helpers: answers.helpersPath, types: answers.typesPath },
  };

  const file = writeConfig(cwd, config);
  p.note(styleText("dim", file), styleText("green", `Created ${CONFIG_FILE}`));
  p.outro(styleText("cyan", "Run `dufresne add` to pull in items."));
}
