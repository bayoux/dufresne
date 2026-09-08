/**
 * @name Mutable
 * @description Strips `readonly` from every top-level property of `T`.
 * @category types
 * @tags types, object, readonly, mutable
 * @usage low
 *
 * @example
 * type Config = { readonly host: string; readonly port: number };
 * type EditableConfig = Mutable<Config>;
 * // { host: string; port: number }
 */
export type Mutable<T> = { -readonly [K in keyof T]: T[K] };
