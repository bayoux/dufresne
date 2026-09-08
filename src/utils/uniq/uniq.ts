/**
 * @name uniq
 * @description Removes duplicate values from an array, optionally by a derived key.
 * @category array
 * @tags array, filter, dedupe
 * @usage high
 *
 * @param {T[]} arr The source array
 * @param {(item: T) => unknown} [iteratee] Optional key selector used to compare items
 * @returns {T[]} A new array with only the first occurrence of each value/key
 *
 * @example
 * uniq([1, 2, 2, 3, 1]); // [1, 2, 3]
 */
export function uniq<T>(arr: T[], iteratee?: (item: T) => unknown): T[] {
  const seen = new Set<unknown>();
  const result: T[] = [];

  for (const item of arr) {
    const key = iteratee ? iteratee(item) : item;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}
