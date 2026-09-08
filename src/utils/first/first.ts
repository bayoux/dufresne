/**
 * @name first
 * @description Returns the first element of an array, or the first `n` when given.
 * @category array
 * @tags array, slice
 * @usage high
 *
 * @param {T[]} arr The source array
 * @param {number} [n] When given, return this many elements instead of one
 * @returns {T | T[] | undefined} The first element, the first `n` elements, or `undefined` for an empty array
 *
 * @example
 * first([1, 2, 3]); // 1
 *
 * @example
 * first([1, 2, 3], 2); // [1, 2]
 */
export function first<T>(arr: T[]): T | undefined;
export function first<T>(arr: T[], n: number): T[];
export function first<T>(arr: T[], n?: number): T | T[] | undefined {
  if (n === undefined) return arr[0];
  return arr.slice(0, Math.max(0, n));
}
