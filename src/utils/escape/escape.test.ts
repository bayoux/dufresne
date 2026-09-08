import assert from "node:assert/strict";
import { test } from "node:test";

import { escape } from "./escape.ts";

test("escapes every HTML-significant character", () => {
  assert.equal(escape(`& < > " ' \``), "&amp; &lt; &gt; &quot; &#39; &#96;");
});

test("leaves plain text untouched", () => {
  assert.equal(escape("hello world"), "hello world");
});

test("escapes a realistic snippet", () => {
  assert.equal(escape("<b>Tom & Jerry</b>"), "&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;");
});
