/**
 * @name clamp
 * @description Restricts a number to the given inclusive range.
 * @category number
 * @tags number, math
 * @usage medium
 *
 * @param {number} value The number to clamp
 * @param {number} min The lower bound
 * @param {number} max The upper bound
 * @returns {number} `value`, or the nearest bound it falls outside of
 *
 * @example
 * clamp(15, 0, 10); // 10
 * clamp(-5, 0, 10); // 0
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) throw new Error("clamp: min must be <= max");
  return Math.min(Math.max(value, min), max);
}
