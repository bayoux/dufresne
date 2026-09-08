/**
 * @name retry
 * @description Retries an async function up to `attempts` times, waiting with exponential backoff between tries. Rethrows the last error once attempts run out.
 * @category pattern
 * @tags pattern, async, resilience
 * @usage high
 *
 * @param {() => Promise<T>} fn The operation to retry
 * @param {{ attempts?: number; delayMs?: number }} [options] `attempts` (default 3), `delayMs` (default 100, doubled each retry)
 * @returns {Promise<T>} The first successful result
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: { attempts?: number; delayMs?: number } = {},
): Promise<T> {
  const attempts = options.attempts ?? 3;
  const delayMs = options.delayMs ?? 100;
  let lastError: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * 2 ** i));
      }
    }
  }

  throw lastError;
}
