import pc from 'picocolors';
import * as p from '@clack/prompts';
import ora from 'ora';

import { fetchRegistry, fetchUtilContent } from './api';
import { saveUtil } from './fs';

function startMessage() {
  p.intro(`${pc.bgCyan(pc.black(' dufresne '))} ${pc.dim(process.env.VERSION)}`);
};

export async function add(name?: string) {
    startMessage();

    let selectedUtilName = name;

    if (!selectedUtilName) {
    const spinner = ora('Fetching registry...').start();
    try {
      const registry = await fetchRegistry();
      spinner.stop();

      const options = registry.utils.map(u => ({
        value: u.name,
        label: u.name,
        hint: u.description
      }));

      const selected = await p.select({
        message: 'Select a utility to add:',
        options: options,
      });

      if (p.isCancel(selected)) {
        p.outro(pc.yellow('Cancelled.'));
        return;
      }

      selectedUtilName = selected as string;
    } catch (error) {
      spinner.fail(pc.red('Failed to load registry.'));
      process.exit(1);
    }
  }

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
}

export async function list() {
  p.intro(pc.magenta('Available Utilities'));
  const spinner = ora('Loading registry...').start();

  try {
    const registry = await fetchRegistry();
    spinner.stop();

    const list = registry.utils.map(util => {
      const labels: string[] = [];

      if (util.dependencies?.npm?.length > 0) {
        labels.push(pc.yellow(`npm: ${util.dependencies.npm.join(', ')}`));
      }

      if (util.dependencies?.internal?.length > 0) {
        labels.push(pc.blue(`internal: ${util.dependencies.internal.join(', ')}`));
      }

      const depsString = labels.length > 0 
        ? pc.dim(` [${labels.join(' | ')}]`) 
        : '';

      return `${pc.cyan('•')} ${pc.bold(util.name.padEnd(15))} ${pc.dim(util.file)}${depsString}`;
    });

    console.log(list.join('\n'));
    console.log('');
    
    p.outro(pc.dim(`${registry.utils.length} utils found.`));
  } catch (error) {
    if (spinner.isSpinning) spinner.stop();
    spinner.fail(pc.red('Failed to fetch list.'));
    p.log.error(pc.red(error instanceof Error ? error.message : 'Unknown error'));
    process.exit(1);
  }
}
