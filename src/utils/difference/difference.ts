/**
 * @name difference
 * @description Returns the values in an array that are not present in any of the other arrays.
 * @category array
 * @tags array, filter, set
 * @usage medium
 *
 * @param {T[]} arr The source array
 * @param {...T[]} others Arrays of values to exclude
 * @returns {T[]} A new array of `arr`'s values that appear in none of `others`
 *
 * @example
 * difference([1, 2, 3, 4], [2, 4]); // [1, 3]
 */
export function difference<T>(arr: T[], ...others: T[][]): T[] {
  const exclude = new Set(others.flat());
  return arr.filter((item) => !exclude.has(item));
}
