/**
 * @name random
 * @description Returns a random integer, inclusive of both bounds. With one argument, the range starts at 0.
 * @category utility
 * @tags number, random
 * @usage low
 *
 * @param {number} minOrMax The max (with one argument) or the min (with two)
 * @param {number} [max] The upper bound, inclusive
 * @returns {number} A random integer in `[min, max]`
 */
export function random(max: number): number;
export function random(min: number, max: number): number;
export function random(minOrMax: number, max?: number): number {
  const [lo, hi] = max === undefined ? [0, minOrMax] : [minOrMax, max];
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}
