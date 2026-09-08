import assert from "node:assert/strict";
import { test } from "node:test";

import { EventEmitter } from "./EventEmitter.ts";

test("calls every listener registered for an event", () => {
  const emitter = new EventEmitter();
  const seen: string[] = [];
  emitter.on("greet", (name: string) => seen.push(`hi ${name}`));
  emitter.on("greet", (name: string) => seen.push(`hey ${name}`));

  emitter.emit("greet", "world");

  assert.deepEqual(seen, ["hi world", "hey world"]);
});

test("off removes a specific listener only", () => {
  const emitter = new EventEmitter();
  let calls = 0;
  const listener = () => calls++;
  emitter.on("tick", listener);
  emitter.on("tick", () => calls++);

  emitter.off("tick", listener);
  emitter.emit("tick");

  assert.equal(calls, 1);
});

test("once fires at most one time", () => {
  const emitter = new EventEmitter();
  let calls = 0;
  emitter.once("boot", () => calls++);

  emitter.emit("boot");
  emitter.emit("boot");

  assert.equal(calls, 1);
});

test("emitting an event with no listeners is a no-op", () => {
  const emitter = new EventEmitter();
  assert.doesNotThrow(() => emitter.emit("nothing"));
});

test("listenerCount reflects the current subscriptions", () => {
  const emitter = new EventEmitter();
  assert.equal(emitter.listenerCount("x"), 0);
  emitter.on("x", () => {});
  assert.equal(emitter.listenerCount("x"), 1);
});
