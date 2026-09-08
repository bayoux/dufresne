/**
 * @name sample
 * @description Picks one random element from an array, or `n` distinct random elements.
 * @category array
 * @tags array, random
 * @usage low
 *
 * @param {T[]} arr The source array
 * @param {number} [n] When given, return this many distinct random elements
 * @returns {T | T[] | undefined} A random element, up to `n` random elements, or `undefined` for an empty array
 */
export function sample<T>(arr: T[]): T | undefined;
export function sample<T>(arr: T[], n: number): T[];
export function sample<T>(arr: T[], n?: number): T | T[] | undefined {
  if (n === undefined) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const pool = arr.slice();
  const count = Math.min(Math.max(0, n), pool.length);
  const result: T[] = [];

  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(index, 1)[0] as T);
  }

  return result;
}
