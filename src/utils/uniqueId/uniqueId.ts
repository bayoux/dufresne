let counter = 0;

/**
 * @name uniqueId
 * @description Generates a unique string id, optionally with a prefix. Backed by a per-process counter.
 * @category utility
 * @tags string, id, generate
 * @usage medium
 *
 * @param {string} [prefix=""] Text to prepend to the id
 * @returns {string} A string unique among calls in this process, e.g. `"1"`, `"2"`, ...
 */
export function uniqueId(prefix = ""): string {
  counter += 1;
  return `${prefix}${counter}`;
}
