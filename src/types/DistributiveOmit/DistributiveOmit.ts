/**
 * @name DistributiveOmit
 * @description Like `Omit`, but distributes over a union instead of collapsing it first. Plain `Omit` on a discriminated union only sees the keys common to every member, so it silently drops the union's other fields; this keeps them.
 * @category types
 * @tags types, object, union, advanced
 * @usage low
 *
 * @example
 * type Shape = { kind: "circle"; r: number } | { kind: "square"; s: number };
 * type WithoutKind = DistributiveOmit<Shape, "kind">;
 * // { r: number } | { s: number }
 */
export type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;
