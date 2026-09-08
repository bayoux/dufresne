import assert from "node:assert/strict";
import { test } from "node:test";

import { extractDoctestPairs } from "./doctest.ts";

test("reads a single inline pair", () => {
  assert.deepEqual(extractDoctestPairs("intersection([1, 2], [2, 3]); // [2]"), [
    { expr: "intersection([1, 2], [2, 3])", expected: "[2]" },
  ]);
});

test("reads every inline pair in a multi-line example", () => {
  assert.deepEqual(extractDoctestPairs("clamp(15, 0, 10); // 10\nclamp(-5, 0, 10); // 0"), [
    { expr: "clamp(15, 0, 10)", expected: "10" },
    { expr: "clamp(-5, 0, 10)", expected: "0" },
  ]);
});

test("reads a statement followed by a standalone comment line", () => {
  const example = 'groupBy([1, 2], (n) => n);\n// { odd: [1], even: [2] }';
  assert.deepEqual(extractDoctestPairs(example), [
    { expr: "groupBy([1, 2], (n) => n)", expected: "{ odd: [1], even: [2] }" },
  ]);
});

test("ignores statements with no attached expectation", () => {
  const example = 'const cb = debounce(() => {}, 200);\nwindow.addEventListener("x", cb);';
  assert.deepEqual(extractDoctestPairs(example), []);
});

test("extraction is purely syntactic — a type-level example still pairs up", () => {
  // Whether `expr`/`expected` actually evaluate is decided later, at eval time
  // (this is why type-only items are filtered out before calling this at all).
  assert.deepEqual(extractDoctestPairs("type Merged = Prettify<A & B>;\n// hovers as { a; b }"), [
    { expr: "type Merged = Prettify<A & B>", expected: "hovers as { a; b }" },
  ]);
});
