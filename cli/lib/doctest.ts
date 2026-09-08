export interface DoctestPair {
  /** The call, without its trailing semicolon (e.g. `chunk([1, 2], 1)`). */
  expr: string;
  /** The literal it's expected to evaluate to (e.g. `[[1], [2]]`). */
  expected: string;
}

const INLINE_RE = /^(.+);\s*\/\/\s*(.+)$/;

/**
 * Pulls `expr; // expected` pairs out of an `@example` block — inline
 * (`chunk(...); // [...]`) or split across two lines (a `;`-terminated
 * statement immediately followed by a `//` comment, as `groupBy`'s does).
 * Anything else (prose, side-effecting snippets, type-level examples) is
 * left alone — this only recognizes patterns precise enough to run as a test.
 */
export function extractDoctestPairs(example: string): DoctestPair[] {
  const lines = example
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const pairs: DoctestPair[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (line.startsWith("//")) continue;

    const inline = line.match(INLINE_RE);
    if (inline) {
      pairs.push({ expr: inline[1]!.trim(), expected: inline[2]!.trim() });
      continue;
    }

    const next = lines[i + 1];
    if (line.endsWith(";") && next?.startsWith("//")) {
      pairs.push({ expr: line.slice(0, -1).trim(), expected: next.slice(2).trim() });
      i++;
    }
  }

  return pairs;
}
