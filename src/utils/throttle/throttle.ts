/**
 * @name throttle
 * @description Wraps a function so it runs at most once per `wait` ms — immediately on the leading call, then once more on the trailing edge if calls kept coming in.
 * @category function
 * @tags function, timing, performance
 * @usage high
 *
 * @param {(...args: Args) => void} fn The function to throttle
 * @param {number} wait Minimum milliseconds between runs
 * @returns {((...args: Args) => void) & { cancel: () => void }} The throttled
 * function; call `.cancel()` to drop a pending trailing call
 *
 * @example
 * const onScroll = throttle(() => console.log("scrolled"), 200);
 * window.addEventListener("scroll", onScroll);
 */
export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
): ((...args: Args) => void) & { cancel: () => void } {
  let lastCall = -Infinity;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingArgs: Args | null = null;

  const invoke = (args: Args) => {
    lastCall = Date.now();
    fn(...args);
  };

  const throttled = (...args: Args): void => {
    const remaining = wait - (Date.now() - lastCall);

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      invoke(args);
      return;
    }

    pendingArgs = args;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        if (pendingArgs) {
          invoke(pendingArgs);
          pendingArgs = null;
        }
      }, remaining);
    }
  };

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    pendingArgs = null;
  };

  return throttled;
}
