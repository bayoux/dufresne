#!/usr/bin/env node
import { Command } from 'commander';
import pc from 'picocolors';
import ora from 'ora';

import { fetchRegistry, fetchUtilContent } from './api';
import { saveUtil } from './fs';

const program = new Command();

program
  .name('dufresne')
  .description(pc.cyan('Fast CLI for import utils'))
  .version('0.0.1');

program
  .command('add')
  .argument('<name>', 'util name')
  .action(async (name: string) => {
    const spinner = ora(`Searching for ${pc.bold(name)}...`).start();
    
    try {
      const registry = await fetchRegistry();
      const util = registry.utils.find(u => u.name === name);

      if (!util) {
        spinner.fail(pc.red(`Util "${name}" not found in registry.`));
        return;
      }

      spinner.text = pc.yellow(`Downloading ${util.file}...`);
      const content = await fetchUtilContent(registry.baseUrl, util.file);

      const path = saveUtil(util.file, content);
      spinner.succeed(pc.green(`Added ${pc.bold(name)}! `) + pc.dim(`Location: ${path}`));

    } catch (error) {
      spinner.fail(pc.red('Error: ') + (error instanceof Error ? error.message : 'Unknown error'));
    }
  });

program
  .command('list')
  .action(async () => {
    const spinner = ora('Fetching registry...').start();
    try {
      const registry = await fetchRegistry();
      spinner.stop();

      console.log(pc.bold(pc.magenta('\n Available utils:')));
      registry.utils.forEach(util => {
        console.log(`${pc.cyan('•')} ${pc.bold(util.name)} ${pc.dim(`(${util.file})`)}`);
        if (util.dependencies?.length) {
          console.log(pc.dim(`  deps: ${util.dependencies.join(', ')}`));
        }
      });
      console.log('');
    } catch (error) {
      spinner.fail(pc.red('Failed to list utils.'));
    }
  });

program.parse(process.argv);
