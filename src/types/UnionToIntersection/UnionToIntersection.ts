/**
 * @name UnionToIntersection
 * @description Converts a union type into an intersection of its members.
 * @category types
 * @tags types, union, intersection, advanced
 * @usage low
 *
 * @example
 * type Combined = UnionToIntersection<{ a: string } | { b: number }>;
 * // { a: string } & { b: number }
 */
export type UnionToIntersection<U> = (U extends unknown ? (arg: U) => void : never) extends (
  arg: infer I,
) => void
  ? I
  : never;
