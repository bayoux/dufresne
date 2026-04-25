/**
* @description Removes all specified values ​​from the array. Uses Set for high performance.
* @tags array, filter, transformation
* @category array
*/
export function pull<T>(arr: T[], ...removeList: T[]): T[] {
  const removeSet = new Set(removeList);
  return arr.filter((el) => !removeSet.has(el));
}
