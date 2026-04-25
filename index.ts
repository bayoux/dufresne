#!/usr/bin/env node
import { Command } from 'commander';
import pc from 'picocolors';
import { add, list } from './commands'

const program = new Command();

program
  .name('dufresne')
  .description(pc.cyan('Fast CLI for import utils'))
  .version('0.0.1');

program
  .command('add')
  .argument('[name]', 'util name')
  .action(async (name?: string) => {
    await add(name);
  });

program
  .command('list')
  .description('Display all available utilities')
  .action(list);

program.parse(process.argv);
