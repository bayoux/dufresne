/**
 * @name omit
 * @description Builds a new object without the given keys.
 * @category object
 * @tags object, filter
 * @usage high
 *
 * @param {T} obj The source object
 * @param {...K} keys The keys to drop
 * @returns {Omit<T, K>} A new object without those keys
 *
 * @example
 * omit({ a: 1, b: 2, c: 3 }, "b"); // { a: 1, c: 3 }
 */
export function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const result: Partial<T> = { ...obj };

  for (const key of keys) {
    delete result[key];
  }

  return result as Omit<T, K>;
}
