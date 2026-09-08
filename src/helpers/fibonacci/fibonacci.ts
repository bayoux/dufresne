const cache = new Map<number, number>([
  [0, 0],
  [1, 1],
]);

/**
 * @name fibonacci
 * @description Returns the n-th Fibonacci number (0-indexed: `fibonacci(0) === 0`, `fibonacci(1) === 1`), memoized across calls.
 * @category algorithm
 * @tags algorithm, number, memoize, recursion
 * @usage low
 *
 * @example
 * fibonacci(10); // 55
 */
export function fibonacci(n: number): number {
  if (!Number.isInteger(n) || n < 0) throw new Error("fibonacci: n must be a non-negative integer");
  if (cache.has(n)) return cache.get(n) as number;

  const result = fibonacci(n - 1) + fibonacci(n - 2);
  cache.set(n, result);
  return result;
}
