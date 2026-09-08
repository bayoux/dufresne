/**
 * @name negate
 * @description Wraps a predicate so it returns the opposite boolean.
 * @category function
 * @tags function, predicate
 * @usage medium
 *
 * @param {(...args: Args) => boolean} predicate The predicate to invert
 * @returns {(...args: Args) => boolean} A predicate returning `!predicate(...args)`
 *
 * @example
 * const isOdd = negate((n: number) => n % 2 === 0);
 * isOdd(3); // true
 */
export function negate<Args extends unknown[]>(
  predicate: (...args: Args) => boolean,
): (...args: Args) => boolean {
  return (...args: Args): boolean => !predicate(...args);
}
