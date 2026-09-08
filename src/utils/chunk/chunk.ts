/**
 * @name chunk
 * @description Splits an array into chunks of the given size.
 * @category array
 * @tags array, split, transform
 * @usage high
 *
 * @param {T[]} arr The source array
 * @param {number} size Max length of each chunk (must be > 0)
 * @returns {T[][]} The array split into chunks, in order
 *
 * @example
 * chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) throw new Error("chunk: size must be greater than 0");

  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
