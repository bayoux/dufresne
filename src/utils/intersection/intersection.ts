/**
 * @name intersection
 * @description Returns the values common to every passed array.
 * @category array
 * @tags array, filter, intersection
 * @usage high
 *
 * @param {...T[]} arrays Two or more arrays to intersect
 * @returns {T[]} A new array of values present in all inputs, ordered by the first
 *
 * @example
 * intersection([1, 2, 3, 4], [2, 3, 5], [0, 2, 3]); // [2, 3]
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];

  return arrays.reduce((acc, currentArray) => {
    const currentSet = new Set(currentArray);
    return acc.filter((item) => currentSet.has(item));
  });
}
