/**
 * Removes JSDoc (`/** … *\/`) comment blocks from a source string, leaving line
 * comments and ordinary code untouched. Used when a consumer opts out of
 * comments in added files.
 */
export function stripJsdoc(source: string): string {
  return source
    .replace(/[ \t]*\/\*\*[^]*?\*\/\n?/g, "")
    .replace(/^\s*\n/, "")
    .replace(/\n{3,}/g, "\n\n");
}
