import type { Registry } from './types'

const REGISTRY_URL = 'https://raw.githubusercontent.com/bayoux/dufresne/main/registry.json';

async function fetchWithTimeout(url: string, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out (connection too slow)');
    }
    throw error;
  }
}

export async function fetchRegistry(): Promise<Registry> {
  try {
    const response = await fetchWithTimeout(REGISTRY_URL);
    if (!response.ok) throw new Error(`Registry unavailable (Status: ${response.status})`);
    
    return await response.json() as Registry;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch registry');
  }
}

export async function fetchUtilContent(baseUrl: string, fileName: string): Promise<string> {
  const fileUrl = `${baseUrl}/utils/${fileName}`;
  
  try {
    const response = await fetchWithTimeout(fileUrl);
    if (!response.ok) throw new Error(`File ${fileName} not found (Status: ${response.status})`);
    
    return await response.text();
  } catch (error) {
    throw new Error(`Failed to download util: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
