const UNESCAPE_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#96;": "`",
};

const UNESCAPE_RE = /&amp;|&lt;|&gt;|&quot;|&#39;|&#96;/g;

/**
 * @name unescape
 * @description Reverses {@link escape}: turns HTML entities back into their literal characters.
 * @category string
 * @tags string, html, unescape
 * @usage low
 *
 * @param {string} str A string possibly containing HTML entities
 * @returns {string} `str` with `&amp; &lt; &gt; &quot; &#39; &#96;` decoded
 *
 * @example
 * unescape("&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;"); // "<b>Tom & Jerry</b>"
 */
export function unescape(str: string): string {
  return str.replace(UNESCAPE_RE, (entity) => UNESCAPE_MAP[entity]!);
}
