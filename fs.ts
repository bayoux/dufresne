import fs from 'node:fs';
import path from 'node:path';

export function saveUtil(fileName: string, content: string) {
  const targetDir = path.join(process.cwd(), 'utils');
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetPath = path.join(targetDir, fileName);
  
  fs.writeFileSync(targetPath, content, { encoding: 'utf-8' });
  return targetPath;
}
