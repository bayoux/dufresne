/**
 * @name set
 * @description Writes a nested property by a dot/bracket path (e.g. `"a.b[0].c"`), creating intermediate objects as needed. Mutates and returns `obj`.
 * @category pattern
 * @tags pattern, object, path
 * @usage medium
 *
 * @example
 * set({}, "a.b.c", 1); // { a: { b: { c: 1 } } }
 */
export function set<T extends object>(obj: T, path: string, value: unknown): T {
  const keys = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

  let current: Record<string, unknown> = obj as Record<string, unknown>;

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

  return obj;
}
