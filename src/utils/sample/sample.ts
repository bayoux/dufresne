import { shuffle } from "#utils/shuffle/shuffle";

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

  return shuffle(arr).slice(0, Math.max(0, n));
}
