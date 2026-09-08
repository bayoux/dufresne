function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) && value.constructor === Object;
}

/**
 * @name deepMerge
 * @description Recursively merges plain objects, later sources winning on conflicts; arrays and non-plain values are replaced outright, not merged element-wise. Never mutates its inputs.
 * @category pattern
 * @tags pattern, object, merge
 * @usage high
 *
 * @example
 * deepMerge({ a: { x: 1 } }, { a: { y: 2 } }); // { a: { x: 1, y: 2 } }
 */
export function deepMerge<T extends object>(...sources: T[]): T {
  const result: Record<string, unknown> = {};

  for (const source of sources) {
    for (const key of Object.keys(source)) {
      const existing = result[key];
      const incoming = (source as Record<string, unknown>)[key];
      result[key] =
        isPlainObject(existing) && isPlainObject(incoming) ? deepMerge(existing, incoming) : incoming;
    }
  }

  return result as T;
}
