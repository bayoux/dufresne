/**
 * @name ArrayElement
 * @description Extracts the element type of an array or tuple.
 * @category types
 * @tags types, array, extract
 * @usage medium
 *
 * @example
 * type Item = ArrayElement<string[]>;
 * // string
 */
export type ArrayElement<T extends readonly unknown[]> = T[number];
