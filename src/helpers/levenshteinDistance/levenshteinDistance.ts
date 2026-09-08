/**
 * @name levenshteinDistance
 * @description The minimum number of single-character edits (insert, delete, substitute) to turn one string into another.
 * @category algorithm
 * @tags algorithm, string, distance, fuzzy-search
 * @usage medium
 *
 * @example
 * levenshteinDistance("kitten", "sitting"); // 3
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row.push(Math.min(row[j - 1]! + 1, prev[j]! + 1, prev[j - 1]! + cost));
    }
    prev = row;
  }

  return prev[b.length]!;
}
