/**
 * @name initial
 * @description Returns every element except the last `n` (default 1).
 * @category array
 * @tags array, slice
 * @usage medium
 *
 * @param {T[]} arr The source array
 * @param {number} [n=1] How many trailing elements to drop
 * @returns {T[]} A new array without the last `n` elements
 *
 * @example
 * initial([1, 2, 3]); // [1, 2]
 *
 * @example
 * initial([1, 2, 3], 2); // [1]
 */
export function initial<T>(arr: T[], n = 1): T[] {
  return arr.slice(0, Math.max(0, arr.length - n));
}
