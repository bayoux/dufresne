/**
 * @name sleep
 * @description Returns a promise that resolves after the given delay.
 * @category async
 * @tags async, promise, timing
 * @usage medium
 *
 * @param {number} ms Delay in milliseconds
 * @returns {Promise<void>}
 *
 * @example
 * await sleep(200);
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
