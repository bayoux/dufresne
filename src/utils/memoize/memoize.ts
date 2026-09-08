/**
 * @name memoize
 * @description Caches a function's results, keyed by its first argument (or a custom resolver).
 * @category function
 * @tags function, cache, performance
 * @usage medium
 *
 * @param {(...args: Args) => R} fn The function to cache
 * @param {(...args: Args) => unknown} [resolver] Derives the cache key from the call's arguments
 * @returns {((...args: Args) => R) & { cache: Map<unknown, R> }} The memoized function; `.cache` exposes the underlying `Map`
 *
 * @example
 * const square = memoize((n: number) => n * n);
 * square(4); // 16
 */
export function memoize<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  resolver?: (...args: Args) => unknown,
): ((...args: Args) => R) & { cache: Map<unknown, R> } {
  const cache = new Map<unknown, R>();

  const memoized = (...args: Args): R => {
    const key = resolver ? resolver(...args) : args[0];
    if (cache.has(key)) return cache.get(key) as R;

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };

  memoized.cache = cache;
  return memoized;
}
