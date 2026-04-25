import type { Registry } from './types.js';

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
    
    if (!response.ok) {
      throw new Error(`Registry unavailable (Status: ${response.status})`);
    }
    
    return await response.json() as Registry;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch registry');
  }
}

export async function fetchUtilContent(baseUrl: string, filePath: string): Promise<string> {
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  
  const fileUrl = `${cleanBase}/${cleanPath}`;
  
  try {
    const response = await fetchWithTimeout(fileUrl);
    
    if (!response.ok) {
      throw new Error(`File not found: ${filePath} (Status: ${response.status})`);
    }
    
    return await response.text();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Download failed: ${error.message}`);
    }
    
    throw new Error(`Failed to download ${filePath}`);
  }
}
