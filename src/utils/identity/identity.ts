/**
 * @name identity
 * @description Returns its single argument unchanged. Useful as a default/no-op callback.
 * @category utility
 * @tags function, default
 * @usage medium
 *
 * @param {T} value Any value
 * @returns {T} The same value
 *
 * @example
 * identity(42); // 42
 */
export function identity<T>(value: T): T {
  return value;
}
