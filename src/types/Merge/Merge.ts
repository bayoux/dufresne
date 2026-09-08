/**
 * @name Merge
 * @description Shallowly merges two object types; `U`'s properties override `T`'s on conflict — the type-level version of `{ ...t, ...u }`.
 * @category types
 * @tags types, object, merge
 * @usage medium
 *
 * @example
 * type Base = { id: string; name: string };
 * type Override = { name: number };
 * type Merged = Merge<Base, Override>;
 * // { id: string; name: number }
 */
export type Merge<T, U> = Omit<T, keyof U> & U;
