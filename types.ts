export type RegistryItem = {
  name: string;
  file: string;
  dependencies?: string[];
}

export type Registry = {
  baseUrl: string;
  utils: RegistryItem[];
}
