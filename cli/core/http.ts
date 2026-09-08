import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Registry } from "../types.ts";

const REGISTRY_URL = "https://raw.githubusercontent.com/bayoux/dufresne/main/registry.json";

async function fetchWithTimeout(url: string, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out (connection too slow)");
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

export async function fetchRegistry(source: string = REGISTRY_URL): Promise<Registry> {
  let registry: Registry;

  if (/^https?:\/\//.test(source)) {
    const response = await fetchWithTimeout(source);
    if (!response.ok) {
      throw new Error(`Registry unavailable (status ${response.status})`);
    }
    registry = (await response.json()) as Registry;
  } else {
    registry = JSON.parse(await readFile(source, "utf-8")) as Registry;
  }

  if (registry.schemaVersion !== "2" || typeof registry.items !== "object") {
    throw new Error(
      `Unsupported registry schema (got ${JSON.stringify(registry.schemaVersion)}, expected "2")`,
    );
  }
  return registry;
}

export async function fetchItemContent(baseUrl: string, filePath: string): Promise<string> {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const cleanPath = filePath.replace(/^\/+/, "");
  const fileUrl = `${cleanBase}/${cleanPath}`;

  const response = await fetchWithTimeout(fileUrl);
  if (!response.ok) {
    throw new Error(`Download failed: ${filePath} (status ${response.status})`);
  }
  return response.text();
}

/**
 * Reads an item's source. When the registry came from a local file, files are
 * read from the sibling `src/` tree so the whole flow works offline.
 */
export async function loadItemContent(
  registry: Registry,
  filePath: string,
  registrySource?: string,
): Promise<string> {
  if (registrySource && !/^https?:\/\//.test(registrySource)) {
    const base = path.join(path.dirname(path.resolve(registrySource)), "src");
    return readFile(path.join(base, filePath), "utf-8");
  }
  return fetchItemContent(registry.baseUrl, filePath);
}
