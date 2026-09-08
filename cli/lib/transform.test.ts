import assert from "node:assert/strict";
import { test } from "node:test";

import { stripJsdoc } from "./transform.ts";

test("removes the leading JSDoc header and keeps the code", () => {
  const src = `/**
 * @name chunk
 * @description Splits an array.
 */
export function chunk() {}
`;
  assert.equal(stripJsdoc(src), "export function chunk() {}\n");
});

test("removes inline JSDoc blocks too", () => {
  const src = `export type A = 1;\n/** doc */\nexport type B = 2;\n`;
  assert.equal(stripJsdoc(src), "export type A = 1;\nexport type B = 2;\n");
});

test("leaves line comments and normal block comments alone", () => {
  const src = `// keep me\n/* also keep */\nexport const x = 1;\n`;
  assert.equal(stripJsdoc(src), src);
});

test("collapses the blank-line run a removed block leaves behind", () => {
  const src = `/**\n * doc\n */\n\n\nexport const x = 1;\n`;
  assert.equal(stripJsdoc(src), "export const x = 1;\n");
});
