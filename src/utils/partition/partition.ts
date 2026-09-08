/**
 * @name partition
 * @description Splits an array into two: items that pass the predicate, and items that don't.
 * @category collection
 * @tags array, filter, split
 * @usage medium
 *
 * @param {T[]} arr The source array
 * @param {(item: T) => boolean} predicate Test applied to each item
 * @returns {[T[], T[]]} A `[pass, fail]` tuple
 *
 * @example
 * partition([1, 2, 3, 4, 5], (n) => n % 2 === 0); // [[2, 4], [1, 3, 5]]
 */
export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];

  for (const item of arr) {
    (predicate(item) ? pass : fail).push(item);
  }

  return [pass, fail];
}
