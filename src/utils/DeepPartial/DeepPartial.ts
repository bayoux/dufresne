/**
 * @name DeepPartial
 * @description Recursively makes every property of `T` (including nested
 * objects and array elements) optional.
 * @category types
 * @tags types, object, partial
 * @usage medium
 *
 * @example
 * type Config = { server: { host: string; port: number } };
 * type PartialConfig = DeepPartial<Config>;
 * // { server?: { host?: string; port?: number } }
 */
export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;
