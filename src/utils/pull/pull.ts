/**
 * @name pull
 * @description Removes every occurrence of the given values from an array.
 * @category array
 * @tags array, filter, transformation
 * @usage high
 *
 * @param {T[]} arr The source array
 * @param {...T} removeList Values to strip out
 * @returns {T[]} A new array without any of the removed values
 *
 * @example
 * pull([1, 2, 3, 1, 2], 2, 3); // [1, 1]
 */
export function pull<T>(arr: T[], ...removeList: T[]): T[] {
  const removeSet = new Set(removeList);
  return arr.filter((el) => !removeSet.has(el));
}
