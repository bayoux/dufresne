import assert from "node:assert/strict";
import { test } from "node:test";

import { unescape } from "./unescape.ts";

test("decodes every escaped entity", () => {
  assert.equal(unescape("&amp; &lt; &gt; &quot; &#39; &#96;"), `& < > " ' \``);
});

test("leaves plain text untouched", () => {
  assert.equal(unescape("hello world"), "hello world");
});

test("round-trips with escape's output", () => {
  assert.equal(unescape("&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;"), "<b>Tom & Jerry</b>");
});
