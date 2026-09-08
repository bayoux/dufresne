/**
 * @name constant
 * @description Creates a function that always returns the given value.
 * @category utility
 * @tags function, default
 * @usage low
 *
 * @param {T} value The value to always return
 * @returns {() => T} A function ignoring its arguments and returning `value`
 *
 * @example
 * constant(42)(); // 42
 */
export function constant<T>(value: T): () => T {
  return () => value;
}
