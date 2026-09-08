/**
 * @name debounce
 * @description Wraps a function so it only runs after `delay` ms of silence.
 * @category function
 * @tags function, timing, performance
 * @usage high
 *
 * @param {(...args: Args) => void} fn The function to debounce
 * @param {number} delay Delay in milliseconds
 * @returns {((...args: Args) => void) & { cancel: () => void }} The debounced
 * function; call `.cancel()` to drop a pending call
 *
 * @example
 * const onResize = debounce(() => console.log("resized"), 200);
 * window.addEventListener("resize", onResize);
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): ((...args: Args) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };

  debounced.cancel = () => clearTimeout(timer);

  return debounced;
}
