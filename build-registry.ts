import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, basename, relative, extname } from 'node:path';
import { createHash } from 'node:crypto';

import type { UtilMetadata } from './types.js';

const SOURCE_DIR = join(process.cwd(), 'src'); 
const REGISTRY_PATH = join(process.cwd(), 'registry.json');
const BASE_URL = 'https://raw.githubusercontent.com/bayoux/dufresne/main/src';


function getFiles(dir: string): string[] {
  const subdirs = readdirSync(dir);
  const files = subdirs.map((subdir) => {
    const res = join(dir, subdir);
    return statSync(res).isDirectory() ? getFiles(res) : res;
  });
  return files.flat().filter(f => ['.ts', '.tsx'].includes(extname(f)));
}

function parseMetadata(content: string, relativePath: string): Partial<UtilMetadata> {
  const description = content.match(/@description\s+(.*)/)?.[1] || `Utility from ${relativePath}`;
  const tags = content.match(/@tags\s+(.*)/)?.[1]?.split(',').map(t => t.trim()) || [];
  const npmDeps = content.match(/@dependency\s+(.*)/)?.[1]?.split(',').map(d => d.trim()) || [];
  const internalDeps = content.match(/@internal\s+(.*)/)?.[1]?.split(',').map(d => d.trim()) || [];
  
  const category = relativePath.split(/[\\/]/)[0] || 'general';

  return { description, tags, category, dependencies: { npm: npmDeps, internal: internalDeps } };
}

function generateHash(content: string) {
  return createHash('sha256').update(content).digest('hex');
}

function buildRegistry() {
  const allFiles = getFiles(SOURCE_DIR);
  
  const utils = allFiles.map((fullPath) => {
    const content = readFileSync(fullPath, 'utf-8');
    const relPath = relative(SOURCE_DIR, fullPath).replace(/\\/g, '/');
    const name = basename(fullPath, extname(fullPath));

    const meta = parseMetadata(content, relPath);

    return {
      id: `idx-${generateHash(relPath).slice(0, 8)}`,
      name: name,
      file: relPath,
      description: meta.description,
      category: meta.category,
      tags: meta.tags,
      hash: generateHash(content),
      dependencies: meta.dependencies
    };
  });

  const registry = {
    schemaVersion: "1",
    baseUrl: BASE_URL,
    utils
  };

  writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
  console.log(`✅ Registry built with ${utils.length} items.`);
}

buildRegistry();
