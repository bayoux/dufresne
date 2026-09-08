function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) && value.constructor === Object;
}

/**
 * @name flattenObject
 * @description Flattens a nested object into a single level, joining keys with `.` (e.g. `{ a: { b: 1 } }` becomes `{ "a.b": 1 }`). Arrays are kept as leaf values, not descended into.
 * @category pattern
 * @tags pattern, object, transform
 * @usage medium
 *
 * @example
 * flattenObject({ a: { b: 1, c: { d: 2 } } }); // { "a.b": 1, "a.c.d": 2 }
 */
export function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(value)) {
      Object.assign(result, flattenObject(value, path));
    } else {
      result[path] = value;
    }
  }

  return result;
}
