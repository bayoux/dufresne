/**
 * @name invert
 * @description Swaps an object's keys and values.
 * @category object
 * @tags object, transform
 * @usage low
 *
 * @param {Record<K, V>} obj The source object; values must be usable as keys
 * @returns {Record<V, K>} A new object with keys and values swapped
 *
 * @example
 * invert({ a: "x", b: "y" }); // { x: "a", y: "b" }
 */
export function invert<K extends PropertyKey, V extends PropertyKey>(obj: Record<K, V>): Record<V, K> {
  const result = {} as Record<V, K>;

  for (const key of Object.keys(obj) as K[]) {
    result[obj[key]] = key;
  }

  return result;
}
