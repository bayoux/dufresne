/**
 * @name ValueOf
 * @description The union of every value type in `T` — like `keyof T`, but for values.
 * @category types
 * @tags types, object, union
 * @usage low
 *
 * @example
 * type Status = ValueOf<{ ACTIVE: "active"; DONE: "done" }>;
 * // "active" | "done"
 */
export type ValueOf<T> = T[keyof T];
