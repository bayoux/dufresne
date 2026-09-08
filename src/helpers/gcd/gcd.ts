/**
 * @name gcd
 * @description The greatest common divisor of two integers (Euclidean algorithm).
 * @category algorithm
 * @tags algorithm, number, math
 * @usage low
 *
 * @example
 * gcd(12, 18); // 6
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b) {
    [a, b] = [b, a % b];
  }

  return a;
}
