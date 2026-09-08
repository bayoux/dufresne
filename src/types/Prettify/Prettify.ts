/**
 * @name Prettify
 * @description Flattens an intersection type into a single object type, so
 * editor tooltips show its final shape (`{ a: string; b: number }`) instead
 * of `A & B`.
 * @category types
 * @tags types, object, dx
 * @usage medium
 *
 * @example
 * type Merged = Prettify<{ a: string } & { b: number }>;
 * // hovers as { a: string; b: number }
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
