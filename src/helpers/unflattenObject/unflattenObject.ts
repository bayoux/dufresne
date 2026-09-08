/**
 * @name unflattenObject
 * @description Rebuilds a nested object from dot-notation keys — the inverse of `flattenObject`.
 * @category pattern
 * @tags pattern, object, transform
 * @usage low
 *
 * @example
 * unflattenObject({ "a.b": 1, "a.c.d": 2 }); // { a: { b: 1, c: { d: 2 } } }
 */
export function unflattenObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [path, value] of Object.entries(obj)) {
    const keys = path.split(".");
    let current = result;

    keys.forEach((key, i) => {
      if (i === keys.length - 1) {
        current[key] = value;
        return;
      }
      if (typeof current[key] !== "object" || current[key] === null) {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    });
  }

  return result;
}
