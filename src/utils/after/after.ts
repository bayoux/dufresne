/**
 * @name after
 * @description Wraps a function so it only runs starting from its `count`-th call.
 * @category function
 * @tags function, guard, counter
 * @usage low
 *
 * @param {number} count How many calls to ignore before running `fn`
 * @param {(...args: Args) => R} fn The function to guard
 * @returns {(...args: Args) => R | undefined} A function that returns `undefined` until the threshold is met
 *
 * @example
 * const done = after(2, () => "all done");
 * done(); // undefined — 1st call
 * done(); // "all done" — 2nd call
 */
export function after<Args extends unknown[], R>(
  count: number,
  fn: (...args: Args) => R,
): (...args: Args) => R | undefined {
  let calls = 0;

  return (...args: Args): R | undefined => {
    calls++;
    return calls >= count ? fn(...args) : undefined;
  };
}
