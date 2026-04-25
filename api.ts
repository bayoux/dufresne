import type { Registry } from './types'

const REGISTRY_URL = 'https://raw.githubusercontent.com/bayoux/dufresne/main/registry.json';

export async function fetchRegistry(): Promise<Registry> {
  const response = await fetch(REGISTRY_URL);
  if (!response.ok) throw new Error(`Registry unavailable: ${response.statusText}`);
  return await response.json() as Registry;
}

export async function fetchUtilContent(baseUrl: string, fileName: string): Promise<string> {
  const fileUrl = `${baseUrl}/utils/${fileName}`;
  const response = await fetch(fileUrl);
  if (!response.ok) throw new Error(`File ${fileName} not found at source.`);
  return await response.text();
}
