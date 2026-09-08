/**
 * @name last
 * @description Returns the last element of an array, or the last `n` when given.
 * @category array
 * @tags array, slice
 * @usage high
 *
 * @param {T[]} arr The source array
 * @param {number} [n] When given, return this many trailing elements instead of one
 * @returns {T | T[] | undefined} The last element, the last `n` elements, or `undefined` for an empty array
 *
 * @example
 * last([1, 2, 3]); // 3
 *
 * @example
 * last([1, 2, 3], 2); // [2, 3]
 */
export function last<T>(arr: T[]): T | undefined;
export function last<T>(arr: T[], n: number): T[];
export function last<T>(arr: T[], n?: number): T | T[] | undefined {
  if (n === undefined) return arr[arr.length - 1];
  if (n <= 0) return [];
  return arr.slice(Math.max(0, arr.length - n));
}
