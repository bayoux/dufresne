#!/usr/bin/env node
import { Command } from 'commander';
import pc from 'picocolors';
import * as p from '@clack/prompts';
import ora from 'ora';

import { fetchRegistry, fetchUtilContent } from './api';
import { saveUtil } from './fs';


const program = new Command();

function startMessage() {
  p.intro(`${pc.bgCyan(pc.black(' dufresne '))} ${pc.dim(process.env.VERSION)}`);
};

program
  .name('dufresne')
  .description(pc.cyan('Fast CLI for import utils'))
  .version('0.0.1');

program
  .command('add')
  .argument('<name>', 'util name')
  .action(async (name: string) => {
    startMessage();

    const spinner = ora(`Searching for ${pc.bold(name)}...`).start();
    
    try {
      const registry = await fetchRegistry();
      const util = registry.utils.find(u => u.name === name);

      if (!util) {
        spinner.fail(pc.red(`Util "${name}" not found in registry.`));
        p.outro(pc.dim('Check the list of available utils with `dufresne list`'));
        return;
      }

      spinner.text = pc.yellow(`Downloading ${util.file}...`);
      const content = await fetchUtilContent(registry.baseUrl, util.file);

      spinner.stop();

      const path = await saveUtil(util.file, content);

      if (path) {
        p.note(pc.dim(path), pc.green(`Added ${pc.bold(name)}!`));
        p.outro(pc.cyan('Done! Happy coding.'));
      } else {
        p.log.warn(pc.yellow(`Skipped ${pc.bold(name)}: file not overwritten.`));
        p.outro(pc.dim('Operation cancelled.'));
      }

    } catch (error) {
      if (spinner.isSpinning) {
        spinner.fail(pc.red('Error occurred:'));
      }

      p.log.error(pc.red(error instanceof Error ? error.message : 'Unknown error'));
      p.outro(pc.red('Installation failed.'));
      process.exit(1);
    }
  });

program
  .command('list')
  .description('Display all available utilities')
  .action(async () => {
    p.intro(pc.magenta('Available Utilities'));
    const spinner = ora('Loading registry...').start();

    try {
      const registry = await fetchRegistry();
      spinner.stop();

      const list = registry.utils.map(util => {
        const deps = util.dependencies?.length 
          ? pc.dim(` [deps: ${util.dependencies.join(', ')}]`) 
          : '';
        return `${pc.cyan('•')} ${pc.bold(util.name.padEnd(12))} ${pc.dim(util.file)}${deps}`;
      });

      console.log(list.join('\n'));
      console.log('');
      
      p.outro(pc.dim(`${registry.utils.length} utils found.`));
    } catch (error) {
      spinner.fail(pc.red('Failed to fetch list.'));
      p.log.error(pc.red(error instanceof Error ? error.message : 'Unknown error'));
      process.exit(1);
    }
  });

program.parse(process.argv);
