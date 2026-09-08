const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#96;",
};

/**
 * @name escape
 * @description Escapes `& < > " ' \`` so a string is safe to drop into HTML.
 * @category string
 * @tags string, html, escape
 * @usage medium
 *
 * @param {string} str The raw string
 * @returns {string} `str` with HTML-significant characters replaced by entities
 *
 * @example
 * escape("<b>Tom & Jerry</b>"); // "&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;"
 */
export function escape(str: string): string {
  return str.replace(/[&<>"'`]/g, (char) => ESCAPE_MAP[char]!);
}
