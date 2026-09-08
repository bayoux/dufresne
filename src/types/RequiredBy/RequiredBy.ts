/**
 * @name RequiredBy
 * @description Makes the given keys of `T` required while leaving the rest
 * as-is — the inverse of `PartialBy`.
 * @category types
 * @tags types, object, required
 * @usage medium
 *
 * @example
 * interface Options { id?: string; label?: string }
 * type WithId = RequiredBy<Options, "id">;
 * // { id: string; label?: string }
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
