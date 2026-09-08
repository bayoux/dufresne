/**
 * @name RequireAtLeastOne
 * @description Keeps every key of `T` optional, except that at least one of the given `K` keys must be present.
 * @category types
 * @tags types, object, required, advanced
 * @usage low
 *
 * @example
 * interface Filters { id?: string; email?: string; phone?: string }
 * type Search = RequireAtLeastOne<Filters, "id" | "email" | "phone">;
 * // needs at least one of id / email / phone
 */
export type RequireAtLeastOne<T, K extends keyof T = keyof T> = Omit<T, K> &
  { [P in K]: Required<Pick<T, P>> & Partial<Omit<T, P>> }[K];
