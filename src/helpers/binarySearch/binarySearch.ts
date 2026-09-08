function defaultCompare<T>(a: T, b: T): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * @name binarySearch
 * @description Finds the index of a value in an array sorted ascending, in O(log n); returns `-1` if absent.
 * @category algorithm
 * @tags algorithm, search, array
 * @usage medium
 *
 * @param {T[]} arr An array already sorted ascending by `compare`
 * @param {T} target The value to find
 * @param {(a: T, b: T) => number} [compare] Comparator; defaults to `<`/`>`
 * @returns {number} The index of `target`, or `-1`
 *
 * @example
 * binarySearch([1, 3, 5, 7, 9], 7); // 3
 */
export function binarySearch<T>(
  arr: T[],
  target: T,
  compare: (a: T, b: T) => number = defaultCompare,
): number {
  let lo = 0;
  let hi = arr.length - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const cmp = compare(arr[mid] as T, target);
    if (cmp === 0) return mid;
    if (cmp < 0) lo = mid + 1;
    else hi = mid - 1;
  }

  return -1;
}
