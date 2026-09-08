function defaultCompare<T>(a: T, b: T): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function partitionAndSort<T>(arr: T[], lo: number, hi: number, compare: (a: T, b: T) => number): void {
  if (lo >= hi) return;

  const pivot = arr[hi] as T;
  let i = lo;

  for (let j = lo; j < hi; j++) {
    if (compare(arr[j] as T, pivot) < 0) {
      [arr[i], arr[j]] = [arr[j] as T, arr[i] as T];
      i++;
    }
  }
  [arr[i], arr[hi]] = [arr[hi] as T, arr[i] as T];

  partitionAndSort(arr, lo, i - 1, compare);
  partitionAndSort(arr, i + 1, hi, compare);
}

/**
 * @name quickSort
 * @description Sorts an array with quicksort (Lomuto partition, average O(n log n)); returns a new array, does not mutate the input.
 * @category algorithm
 * @tags algorithm, sort, array
 * @usage low
 *
 * @param {T[]} arr The array to sort
 * @param {(a: T, b: T) => number} [compare] Comparator; defaults to `<`/`>`
 * @returns {T[]} A new, sorted array
 *
 * @example
 * quickSort([5, 3, 8, 1, 9, 2]); // [1, 2, 3, 5, 8, 9]
 */
export function quickSort<T>(arr: T[], compare: (a: T, b: T) => number = defaultCompare): T[] {
  const result = arr.slice();
  partitionAndSort(result, 0, result.length - 1, compare);
  return result;
}
