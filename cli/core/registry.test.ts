import assert from "node:assert/strict";
import { test } from "node:test";

import type { Registry, RegistryItem } from "../types.ts";
import { resolveDependencies } from "./registry.ts";

function item(name: string, over: Partial<RegistryItem> = {}): RegistryItem {
  return {
    id: `dfr-${name}`,
    type: "util",
    name,
    file: `utils/${name}/${name}.ts`,
    description: name,
    category: "test",
    tags: [],
    examples: [],
    hash: "x",
    dependencies: { npm: [], internal: [] },
    ...over,
  };
}

function registry(items: RegistryItem[]): Registry {
  return {
    schemaVersion: "2",
    baseUrl: "https://example.test/src",
    items: Object.fromEntries(items.map((i) => [i.name, i])),
  };
}

test("orders dependencies before dependents and de-dupes", () => {
  const reg = registry([
    item("a", { dependencies: { npm: ["p-a"], internal: ["b", "c"] } }),
    item("b", { dependencies: { npm: [], internal: ["c"] } }),
    item("c", { dependencies: { npm: ["p-c"], internal: [] } }),
  ]);

  const plan = resolveDependencies(reg, ["a"]);
  assert.deepEqual(
    plan.items.map((i) => i.name),
    ["c", "b", "a"],
  );
  assert.deepEqual(plan.npm, ["p-a", "p-c"]);
});

test("throws on a missing top-level item", () => {
  assert.throws(() => resolveDependencies(registry([item("a")]), ["nope"]), /not in the registry/);
});

test("throws with context on a missing transitive dep", () => {
  const reg = registry([item("a", { dependencies: { npm: [], internal: ["ghost"] } })]);
  assert.throws(() => resolveDependencies(reg, ["a"]), /"a" depends on "ghost"/);
});

test("throws on a dependency cycle", () => {
  const reg = registry([
    item("a", { dependencies: { npm: [], internal: ["b"] } }),
    item("b", { dependencies: { npm: [], internal: ["a"] } }),
  ]);
  assert.throws(() => resolveDependencies(reg, ["a"]), /Circular dependency/);
});
