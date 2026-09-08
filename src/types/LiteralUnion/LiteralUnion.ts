/**
 * @name LiteralUnion
 * @description A union of literal values that still accepts any value of the base type — keeps editor autocomplete for the literals without losing flexibility (unlike `T | string`, which collapses to just `string`).
 * @category types
 * @tags types, union, literal
 * @usage medium
 *
 * @example
 * type Size = LiteralUnion<"sm" | "md" | "lg", string>;
 * // autocompletes "sm" | "md" | "lg", but still accepts any other string
 */
export type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);
