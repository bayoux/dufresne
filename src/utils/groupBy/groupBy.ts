/**
 * @name groupBy
 * @description Groups array items into a record keyed by the given selector.
 * @category array
 * @tags array, object, group
 * @usage high
 *
 * @param {T[]} arr The source array
 * @param {(item: T) => K} key Selector producing the group key for each item
 * @returns {Record<K, T[]>} Items grouped by key, insertion order preserved
 *
 * @example
 * groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? "even" : "odd"));
 * // { odd: [1, 3], even: [2, 4] }
 */
export function groupBy<T, K extends PropertyKey>(arr: T[], key: (item: T) => K): Record<K, T[]> {
  const result = {} as Record<K, T[]>;

  for (const item of arr) {
    const groupKey = key(item);
    (result[groupKey] ??= []).push(item);
  }

  return result;
}
