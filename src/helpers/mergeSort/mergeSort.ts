function defaultCompare<T>(a: T, b: T): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function merge<T>(left: T[], right: T[], compare: (a: T, b: T) => number): T[] {
  const result: T[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (compare(left[i] as T, right[j] as T) <= 0) result.push(left[i++] as T);
    else result.push(right[j++] as T);
  }
  while (i < left.length) result.push(left[i++] as T);
  while (j < right.length) result.push(right[j++] as T);

  return result;
}

/**
 * @name mergeSort
 * @description Sorts an array with merge sort — stable, guaranteed O(n log n). Returns a new array, does not mutate the input.
 * @category algorithm
 * @tags algorithm, sort, array
 * @usage low
 *
 * @param {T[]} arr The array to sort
 * @param {(a: T, b: T) => number} [compare] Comparator; defaults to `<`/`>`
 * @returns {T[]} A new, sorted array
 *
 * @example
 * mergeSort([5, 3, 8, 1, 9, 2]); // [1, 2, 3, 5, 8, 9]
 */
export function mergeSort<T>(arr: T[], compare: (a: T, b: T) => number = defaultCompare): T[] {
  if (arr.length <= 1) return arr.slice();

  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid), compare);
  const right = mergeSort(arr.slice(mid), compare);

  return merge(left, right, compare);
}
