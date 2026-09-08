/**
 * @name DeepMutable
 * @description Recursively strips `readonly` from `T`, including nested
 * objects and array elements — the inverse of `DeepReadonly`.
 * @category types
 * @tags types, object, readonly, mutable
 * @usage low
 *
 * @example
 * type Config = { readonly server: { readonly host: string } };
 * type EditableConfig = DeepMutable<Config>;
 * // { server: { host: string } }
 */
export type DeepMutable<T> = T extends readonly (infer U)[]
  ? DeepMutable<U>[]
  : T extends object
    ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
    : T;
