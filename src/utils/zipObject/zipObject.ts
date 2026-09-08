/**
 * @name zipObject
 * @description Builds an object from parallel key/value arrays, or from `[key, value]` pairs.
 * @category array
 * @tags array, object, transform
 * @usage low
 *
 * @param {K[] | Array<[K, V]>} keysOrPairs Keys, or `[key, value]` pairs
 * @param {V[]} [values] Values, when `keysOrPairs` is a plain key array
 * @returns {Record<K, V>} The assembled object
 *
 * @example
 * zipObject(["a", "b"], [1, 2]); // { a: 1, b: 2 }
 */
export function zipObject<K extends PropertyKey, V>(keys: K[], values: V[]): Record<K, V>;
export function zipObject<K extends PropertyKey, V>(pairs: Array<[K, V]>): Record<K, V>;
export function zipObject<K extends PropertyKey, V>(
  keysOrPairs: K[] | Array<[K, V]>,
  values?: V[],
): Record<K, V> {
  const result = {} as Record<K, V>;

  if (values) {
    (keysOrPairs as K[]).forEach((key, i) => {
      result[key] = values[i] as V;
    });
  } else {
    (keysOrPairs as Array<[K, V]>).forEach(([key, value]) => {
      result[key] = value;
    });
  }

  return result;
}
