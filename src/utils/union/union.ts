/**
 * @name union
 * @description Merges arrays and removes duplicates, keeping first-seen order.
 * @category array
 * @tags array, merge, dedupe
 * @usage medium
 *
 * @param {...T[]} arrays Two or more arrays to combine
 * @returns {T[]} The de-duplicated union of every array
 *
 * @example
 * union([1, 2], [2, 3], [3, 4]); // [1, 2, 3, 4]
 */
export function union<T>(...arrays: T[][]): T[] {
  return [...new Set(arrays.flat())];
}
