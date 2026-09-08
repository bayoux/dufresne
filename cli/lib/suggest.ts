/** Classic edit-distance, used to turn typos into "did you mean" suggestions. */
export function levenshtein(a: string, b: string): number {
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

/**
 * Ranks `candidates` by closeness to `query` (case-insensitive edit distance,
 * with a bonus for a plain substring match) and returns the best few.
 */
export function suggest(query: string, candidates: string[], limit = 3): string[] {
  const q = query.toLowerCase();
  const maxDistance = Math.max(2, Math.floor(q.length / 3));

  return candidates
    .map((name) => {
      const n = name.toLowerCase();
      const substring = n.includes(q) || q.includes(n);
      const distance = levenshtein(q, n);
      return { name, distance: substring ? Math.min(distance, 1) : distance };
    })
    .filter((c) => c.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map((c) => c.name);
}
