/**
 * @description Returns the intersection of multiple arrays. 
 * Uses a Set for high-performance lookups during the filtering process.
 * @tags array, filter, intersection
 * @category array
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];

  return arrays.reduce((acc, currentArray) => {
    const currentSet = new Set(currentArray);
    return acc.filter((item) => currentSet.has(item));
  });
}
