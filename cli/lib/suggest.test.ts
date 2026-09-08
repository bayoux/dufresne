import assert from "node:assert/strict";
import { test } from "node:test";

import { levenshtein, suggest } from "./suggest.ts";

test("levenshtein counts single-character edits", () => {
  assert.equal(levenshtein("chunk", "chunk"), 0);
  assert.equal(levenshtein("clam", "clamp"), 1);
  assert.equal(levenshtein("kitten", "sitting"), 3);
});

test("suggest ranks a near typo first", () => {
  const names = ["chunk", "clamp", "debounce", "groupBy", "intersection", "pull", "sleep"];
  assert.deepEqual(suggest("clam", names, 1), ["clamp"]);
  assert.deepEqual(suggest("chnk", names, 1), ["chunk"]);
});

test("suggest matches a substring even across a longer edit distance", () => {
  const names = ["intersection", "chunk"];
  assert.deepEqual(suggest("section", names, 1), ["intersection"]);
});

test("suggest returns nothing for an unrelated query", () => {
  assert.deepEqual(suggest("xyzzyplugh", ["chunk", "clamp"], 3), []);
});
