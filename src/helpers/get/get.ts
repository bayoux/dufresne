/**
 * @name get
 * @description Safely reads a nested property by a dot/bracket path (e.g. `"a.b[0].c"`), returning a fallback if any step is missing.
 * @category pattern
 * @tags pattern, object, path
 * @usage high
 *
 * @example
 * get({ a: { b: [1, 2] } }, "a.b[1]"); // 2
 */
export function get(obj: unknown, path: string, fallback?: unknown): unknown {
  const keys = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || typeof current !== "object") return fallback;
    current = (current as Record<string, unknown>)[key];
  }

  return current === undefined ? fallback : current;
}
