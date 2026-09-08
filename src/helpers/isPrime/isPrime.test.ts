import assert from "node:assert/strict";
import { test } from "node:test";

import { isPrime } from "./isPrime.ts";

test("identifies primes", () => {
  for (const n of [2, 3, 5, 7, 11, 97]) assert.equal(isPrime(n), true, `${n} should be prime`);
});

test("identifies non-primes", () => {
  for (const n of [0, 1, 4, 9, 100]) assert.equal(isPrime(n), false, `${n} should not be prime`);
});

test("rejects negative numbers and non-integers", () => {
  assert.equal(isPrime(-7), false);
  assert.equal(isPrime(2.5), false);
});
