/**
 * @name compact
 * @description Removes every falsy value (`false`, `0`, `""`, `null`, `undefined`, `NaN`) from an array.
 * @category array
 * @tags array, filter
 * @usage high
 *
 * @param {T[]} arr The source array
 * @returns {T[]} A new array with only the truthy values, in order
 *
 * @example
 * compact([0, 1, false, 2, "", 3]); // [1, 2, 3]
 */
export function compact<T>(arr: T[]): T[] {
  return arr.filter(Boolean);
}
