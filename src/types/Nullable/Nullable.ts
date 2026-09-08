/**
 * @name Nullable
 * @description Allows `T` or `null` — distinct from an optional property, which also allows `undefined`.
 * @category types
 * @tags types, null
 * @usage medium
 *
 * @example
 * type MaybeUser = Nullable<{ id: string }>;
 * // { id: string } | null
 */
export type Nullable<T> = T | null;
