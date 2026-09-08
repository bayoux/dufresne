/**
 * @name isEqual
 * @description Deep-compares two values: arrays, dates, and plain objects are compared by content.
 * @category object
 * @tags object, compare, equality
 * @usage high
 *
 * @param {unknown} a The first value
 * @param {unknown} b The second value
 * @returns {boolean} Whether `a` and `b` are structurally equal
 *
 * @example
 * isEqual({ a: [1, 2] }, { a: [1, 2] }); // true
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, i) => isEqual(item, b[i]));
  }

  if (a instanceof Date || b instanceof Date) {
    return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
  }

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const aKeys = Object.keys(objA);
  const bKeys = Object.keys(objB);

  return aKeys.length === bKeys.length && aKeys.every((key) => key in objB && isEqual(objA[key], objB[key]));
}
