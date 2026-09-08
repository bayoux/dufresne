/**
 * @name isPrime
 * @description Checks whether an integer is prime, by trial division up to `sqrt(n)`.
 * @category algorithm
 * @tags algorithm, number, math
 * @usage low
 *
 * @example
 * isPrime(17); // true
 *
 * @example
 * isPrime(18); // false
 */
export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;

  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }

  return true;
}
