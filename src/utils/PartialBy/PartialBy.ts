/**
 * @name PartialBy
 * @description Makes the given keys of `T` optional while leaving the rest
 * required.
 * @category types
 * @tags types, object, partial
 * @usage medium
 *
 * @example
 * interface User { id: string; name: string; email: string }
 * type NewUser = PartialBy<User, "id">;
 * // { id?: string; name: string; email: string }
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
