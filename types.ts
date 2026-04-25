export type UtilMetadata = {
  id: string;
  name: string;
  file: string;
  description: string;
  category: string;
  tags: string[];
  hash: string;
  dependencies: {
    npm: string[];
    internal: string[];
  };
}

export type Registry = {
  baseUrl: string;
  utils: UtilMetadata[];
}
