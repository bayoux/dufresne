/**
 * @name isEmpty
 * @description Checks whether a value has no content: `null`/`undefined`, an empty array/string, an empty `Map`/`Set`, or an object with no own keys.
 * @category object
 * @tags object, array, check
 * @usage medium
 *
 * @param {unknown} value The value to check
 * @returns {boolean} Whether `value` is considered empty
 *
 * @example
 * isEmpty({}); // true
 *
 * @example
 * isEmpty({ a: 1 }); // false
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (Array.isArray(value) || typeof value === "string") return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}
