import assert from "node:assert/strict";
import { test } from "node:test";

import { StateMachine } from "./StateMachine.ts";

type Light = "red" | "green" | "yellow";
type Event = "go" | "caution" | "stop";

function trafficLight() {
  return new StateMachine<Light, Event>("red", {
    red: { go: "green" },
    green: { caution: "yellow" },
    yellow: { stop: "red" },
  });
}

test("transitions on a valid event", () => {
  const light = trafficLight();
  assert.equal(light.send("go"), true);
  assert.equal(light.state, "green");
});

test("ignores an event that isn't valid from the current state", () => {
  const light = trafficLight();
  assert.equal(light.send("stop"), false);
  assert.equal(light.state, "red");
});

test("can() reports whether an event is currently valid", () => {
  const light = trafficLight();
  assert.equal(light.can("go"), true);
  assert.equal(light.can("caution"), false);
});

test("walks through a full cycle back to the start", () => {
  const light = trafficLight();
  light.send("go");
  light.send("caution");
  light.send("stop");
  assert.equal(light.state, "red");
});
