import fs from 'node:fs';
import path from 'node:path';
import * as p from '@clack/prompts';
import pc from 'picocolors';

export async function saveUtil(fileName: string, content: string): Promise<string | null> {
  const safeName = path.basename(fileName);

  const allowedExtensions = ['.ts', '.js', '.tsx', '.jsx'];
  const ext = path.extname(safeName);
  
  if (!allowedExtensions.includes(ext)) {
    throw new Error(`Forbidden file extension: ${ext || 'no extension'}`);
  }

  const targetDir = path.join(process.cwd(), 'utils');
  const targetPath = path.join(targetDir, safeName);

  if (fs.existsSync(targetPath)) {
    const shouldOverwrite = await p.confirm({
      message: `File ${pc.bold(safeName)} already exists. ${pc.yellow('Overwrite?')}`,
      initialValue: false,
    });

    if (p.isCancel(shouldOverwrite) || !shouldOverwrite) {
      return null; 
    }
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  try {
    fs.writeFileSync(targetPath, content, { encoding: 'utf-8', mode: 0o644 });
    return targetPath;
  } catch (err) {
    throw new Error(`Failed to write file: ${err instanceof Error ? err.message : String(err)}`);
  }
}
