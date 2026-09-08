/**
 * @name zip
 * @description Transposes a list of arrays: groups every array's i-th element together.
 * @category array
 * @tags array, transform, transpose
 * @usage low
 *
 * @param {...unknown[][]} arrays The arrays to transpose
 * @returns {unknown[][]} An array of tuples, one per index (missing entries are `undefined`)
 *
 * @example
 * zip(["a", "b"], [1, 2], [true, false]); // [["a", 1, true], ["b", 2, false]]
 */
export function zip(...arrays: unknown[][]): unknown[][] {
  const length = Math.max(0, ...arrays.map((a) => a.length));
  return Array.from({ length }, (_, i) => arrays.map((a) => a[i]));
}
