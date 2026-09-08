/**
 * @name compose
 * @description Composes functions right to left: the last one runs first, fed with the original arguments.
 * @category function
 * @tags function, pipeline
 * @usage medium
 *
 * @param {...(...args: any[]) => any} fns The functions to compose
 * @returns {(...args: any[]) => any} A function running every `fns` right to left
 *
 * @example
 * const shout = compose((s: string) => s + "!", (s: string) => s.toUpperCase());
 * shout("hi"); // "HI!"
 */
// A generically-typed compose can't express "each fn's output feeds the next
// fn's input" without heavy per-arity overloads, so this intentionally opts
// out of parameter checking the way most compose/pipe implementations do.
export function compose(...fns: Array<(...args: any[]) => any>): (...args: any[]) => any {
  return (...args: unknown[]): unknown => {
    if (!fns.length) return args[0];

    let result: unknown = fns[fns.length - 1]!(...args);
    for (let i = fns.length - 2; i >= 0; i--) result = fns[i]!(result);
    return result;
  };
}
