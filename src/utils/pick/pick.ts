/**
 * @name pick
 * @description Builds a new object containing only the given keys.
 * @category object
 * @tags object, filter
 * @usage high
 *
 * @param {T} obj The source object
 * @param {...K} keys The keys to keep
 * @returns {Pick<T, K>} A new object with only those keys
 *
 * @example
 * pick({ a: 1, b: 2, c: 3 }, "a", "c"); // { a: 1, c: 3 }
 */
export function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (key in obj) result[key] = obj[key];
  }

  return result;
}
