/**
 * @name DeepRequired
 * @description Recursively makes every property of `T` (including nested
 * objects and array elements) required, stripping `undefined` — the inverse
 * of `DeepPartial`.
 * @category types
 * @tags types, object, required
 * @usage low
 *
 * @example
 * type Config = { server?: { host?: string; port?: number } };
 * type FullConfig = DeepRequired<Config>;
 * // { server: { host: string; port: number } }
 */
export type DeepRequired<T> = T extends (infer U)[]
  ? DeepRequired<U>[]
  : T extends object
    ? { [K in keyof T]-?: DeepRequired<NonNullable<T[K]>> }
    : T;
