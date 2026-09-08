function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b) {
    [a, b] = [b, a % b];
  }

  return a;
}

/**
 * @name lcm
 * @description The least common multiple of two integers.
 * @category algorithm
 * @tags algorithm, number, math
 * @usage low
 *
 * @example
 * lcm(4, 6); // 12
 */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}
