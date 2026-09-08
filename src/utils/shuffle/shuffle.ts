/**
 * @name shuffle
 * @description Returns a new array with the same elements in random order (Fisher-Yates).
 * @category array
 * @tags array, random
 * @usage low
 *
 * @param {T[]} arr The source array
 * @returns {T[]} A shuffled copy; `arr` itself is left untouched
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = arr.slice();

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T];
  }

  return result;
}
