/**
 * @name pluck
 * @description Extracts a single property's value from every item in an array.
 * @category collection
 * @tags array, object, extract
 * @usage medium
 *
 * @param {T[]} arr The source array of objects
 * @param {K} key The property to extract from each item
 * @returns {Array<T[K]>} The extracted values, in order
 *
 * @example
 * pluck([{ id: 1 }, { id: 2 }], "id"); // [1, 2]
 */
export function pluck<T, K extends keyof T>(arr: T[], key: K): Array<T[K]> {
  return arr.map((item) => item[key]);
}
