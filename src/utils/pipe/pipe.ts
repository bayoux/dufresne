/**
 * @name pipe
 * @description Composes functions left to right: the first one runs first, each result feeding the next. The mirror image of `compose`.
 * @category function
 * @tags function, pipeline
 * @usage medium
 *
 * @param {...(...args: any[]) => any} fns The functions to compose
 * @returns {(...args: any[]) => any} A function running every `fns` left to right
 *
 * @example
 * const shout = pipe((s: string) => s.toUpperCase(), (s: string) => s + "!");
 * shout("hi"); // "HI!"
 */
// See compose.ts for why this intentionally opts out of parameter checking.
export function pipe(...fns: Array<(...args: any[]) => any>): (...args: any[]) => any {
  return (...args: unknown[]): unknown => {
    if (!fns.length) return args[0];

    let result: unknown = fns[0]!(...args);
    for (let i = 1; i < fns.length; i++) result = fns[i]!(result);
    return result;
  };
}
