/**
 * @name times
 * @description Invokes a function `n` times, collecting the results.
 * @category utility
 * @tags function, generate, loop
 * @usage medium
 *
 * @param {number} n How many times to call `fn`
 * @param {(index: number) => T} fn Called with the current index, `0` to `n - 1`
 * @returns {T[]} The collected results, in order
 *
 * @example
 * times(3, (i) => i * 2); // [0, 2, 4]
 */
export function times<T>(n: number, fn: (index: number) => T): T[] {
  const result: T[] = [];

  for (let i = 0; i < n; i++) result.push(fn(i));

  return result;
}
