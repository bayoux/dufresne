import assert from "node:assert/strict";
import { test } from "node:test";

import type { Brand } from "./Brand.ts";

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

const asUserId = (id: string) => id as UserId;

test("behaves like the underlying primitive at runtime", () => {
  const id = asUserId("u1");
  assert.equal(id, "u1");
  assert.equal(typeof id, "string");
});

test("rejects a plain string without a cast, at compile time", () => {
  // @ts-expect-error a plain string is not a UserId
  const id: UserId = "u1";
  assert.equal(id, "u1");
});

test("rejects mixing branded types of the same base primitive, at compile time", () => {
  const userId = asUserId("u1");
  // @ts-expect-error UserId and OrderId are not interchangeable
  const orderId: OrderId = userId;
  assert.equal(orderId, "u1");
});
