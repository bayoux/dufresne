type Without<T, U> = { [K in Exclude<keyof T, keyof U>]?: never };

/**
 * @name XOR
 * @description Exclusive-or of two object types: allows the shape of `T` or the shape of `U`, but never a mix of both.
 * @category types
 * @tags types, object, union, advanced
 * @usage low
 *
 * @example
 * type ById = { id: string };
 * type ByName = { name: string };
 * type Lookup = XOR<ById, ByName>;
 * // { id: string } | { name: string } — never both at once
 */
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
