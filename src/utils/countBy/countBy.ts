/**
 * @name countBy
 * @description Counts array items grouped by the given selector.
 * @category collection
 * @tags array, object, group, count
 * @usage medium
 *
 * @param {T[]} arr The source array
 * @param {(item: T) => K} key Selector producing the group key for each item
 * @returns {Record<K, number>} How many items fell into each group
 *
 * @example
 * countBy([1, 2, 3, 4, 5], (n) => (n % 2 === 0 ? "even" : "odd"));
 * // { odd: 3, even: 2 }
 */
export function countBy<T, K extends PropertyKey>(arr: T[], key: (item: T) => K): Record<K, number> {
  const result = {} as Record<K, number>;

  for (const item of arr) {
    const groupKey = key(item);
    result[groupKey] = (result[groupKey] ?? 0) + 1;
  }

  return result;
}
