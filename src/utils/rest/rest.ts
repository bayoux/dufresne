/**
 * @name rest
 * @description Returns every element except the first `n` (default 1).
 * @category array
 * @tags array, slice
 * @usage medium
 *
 * @param {T[]} arr The source array
 * @param {number} [n=1] How many leading elements to drop
 * @returns {T[]} A new array without the first `n` elements
 *
 * @example
 * rest([1, 2, 3]); // [2, 3]
 *
 * @example
 * rest([1, 2, 3], 2); // [3]
 */
export function rest<T>(arr: T[], n = 1): T[] {
  return arr.slice(Math.max(0, n));
}
