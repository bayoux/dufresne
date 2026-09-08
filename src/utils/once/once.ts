/**
 * @name once
 * @description Wraps a function so it only ever runs the first time it's called.
 * @category function
 * @tags function, guard
 * @usage high
 *
 * @param {(...args: Args) => R} fn The function to guard
 * @returns {(...args: Args) => R} A function that calls `fn` once and caches its result
 *
 * @example
 * once(() => 1)(); // 1
 */
export function once<Args extends unknown[], R>(fn: (...args: Args) => R): (...args: Args) => R {
  let called = false;
  let result: R;

  return (...args: Args): R => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}
