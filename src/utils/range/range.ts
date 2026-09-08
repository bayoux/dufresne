/**
 * @name range
 * @description Builds an array of numbers from `start` up to (excluding) `stop`, by `step`.
 * @category array
 * @tags array, number, generate
 * @usage medium
 *
 * @param {number} startOrStop The start (or, with one argument, the stop) of the range
 * @param {number} [stop] The exclusive end of the range
 * @param {number} [step=1] The increment between values; must not be 0
 * @returns {number[]} The generated sequence
 *
 * @example
 * range(5); // [0, 1, 2, 3, 4]
 *
 * @example
 * range(2, 10, 2); // [2, 4, 6, 8]
 */
export function range(stop: number): number[];
export function range(start: number, stop: number, step?: number): number[];
export function range(startOrStop: number, stop?: number, step = 1): number[] {
  if (step === 0) throw new Error("range: step must not be 0");

  const [start, end] = stop === undefined ? [0, startOrStop] : [startOrStop, stop];
  const length = Math.max(Math.ceil((end - start) / step), 0);
  const result: number[] = [];

  for (let i = 0; i < length; i++) result.push(start + i * step);

  return result;
}
