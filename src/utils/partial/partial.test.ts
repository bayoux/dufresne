import assert from "node:assert/strict";
import { test } from "node:test";

import { partial } from "./partial.ts";

test("pre-fills the leading arguments", () => {
  const add = (a: number, b: number, c: number) => a + b + c;
  const addTen = partial(add, 10);

  assert.equal(addTen(1, 2), 13);
});

test("fixes every argument when none are left", () => {
  const greet = (greeting: string, name: string) => `${greeting}, ${name}!`;
  const helloWorld = partial(greet, "Hello", "world");

  assert.equal(helloWorld(), "Hello, world!");
});
