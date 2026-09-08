/**
 * @name DeepReadonly
 * @description Recursively makes every property of `T` (including nested
 * objects and array elements) readonly.
 * @category types
 * @tags types, object, readonly, immutable
 * @usage low
 *
 * @example
 * type Config = { server: { host: string } };
 * type ImmutableConfig = DeepReadonly<Config>;
 * // { readonly server: { readonly host: string } }
 */
export type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;
