export function pull<T>(arr: T[], ...removeList: T[]): T[] {
    const removeSet = new Set(removeList);
    return arr.filter((el) => !removeSet.has(el));
}
