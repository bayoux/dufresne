/**
 * @name Entries
 * @description A typed version of `Object.entries`'s return shape: an array of `[key, value]` tuples for `T`.
 * @category types
 * @tags types, object, tuple
 * @usage low
 *
 * @example
 * type UserEntries = Entries<{ id: string; age: number }>;
 * // Array<["id", string] | ["age", number]>
 */
export type Entries<T extends object> = Array<{ [K in keyof T]: [K, T[K]] }[keyof T]>;
