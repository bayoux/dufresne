/**
 * @name partial
 * @description Pre-fills a function's leading arguments, returning a function for the rest.
 * @category function
 * @tags function, currying
 * @usage medium
 *
 * @param {(...args: [...Args, ...Rest]) => R} fn The function to partially apply
 * @param {...Args} partialArgs Arguments to fix in place, left to right
 * @returns {(...rest: Rest) => R} A function taking whatever arguments remain
 *
 * @example
 * const greet = (greeting: string, name: string) => `${greeting}, ${name}!`;
 * partial(greet, "Hello")("world"); // "Hello, world!"
 */
export function partial<Args extends unknown[], Rest extends unknown[], R>(
  fn: (...args: [...Args, ...Rest]) => R,
  ...partialArgs: Args
): (...rest: Rest) => R {
  return (...rest: Rest): R => fn(...partialArgs, ...rest);
}
