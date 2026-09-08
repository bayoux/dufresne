import assert from "node:assert/strict";
import { test } from "node:test";

import { extractDependencies, matchJsdoc, parseMetadata } from "./metadata.ts";

const DOC = `/**
 * @name deepMerge
 * @description - Recursively merges plain objects.
 * @category object
 * @tags object, merge
 * @usage high
 *
 * @example
 * deepMerge({ a: 1 }, { b: 2 }); // { a: 1, b: 2 }
 *
 * @example
 * deepMerge({ a: { x: 1 } }, { a: { y: 2 } });
 */
export function deepMerge() {}
`;

test("matchJsdoc grabs only the leading block", () => {
  const block = matchJsdoc(DOC);
  assert.ok(block?.startsWith("/**"));
  assert.ok(block?.endsWith("*/"));
});

test("parseMetadata reads every tag and strips the leading dash", () => {
  const meta = parseMetadata(DOC, "utils/deepMerge/deepMerge.ts");
  assert.equal(meta.name, "deepMerge");
  assert.equal(meta.description, "Recursively merges plain objects.");
  assert.equal(meta.category, "object");
  assert.deepEqual(meta.tags, ["object", "merge"]);
  assert.equal(meta.usage, "high");
});

test("parseMetadata collects each @example block", () => {
  const meta = parseMetadata(DOC, "x");
  assert.equal(meta.examples.length, 2);
  assert.equal(meta.examples[0], "deepMerge({ a: 1 }, { b: 2 }); // { a: 1, b: 2 }");
  assert.match(meta.examples[1]!, /deepMerge\(\{ a: \{ x: 1 \} \}/);
});

test("parseMetadata ignores @description that only appears in code", () => {
  const meta = parseMetadata(`const s = "@description not real";\nexport const x = 1;`, "utils/x/x.ts");
  assert.equal(meta.description, "");
  assert.equal(meta.category, "utils");
  assert.equal(meta.usage, undefined);
});

test("extractDependencies classifies imports", () => {
  const deps = extractDependencies(
    `import { readFileSync } from 'node:fs';
     import dayjs from 'dayjs';
     import { z } from 'zod/v4';
     import { compact } from '#utils/compact/compact';
     import { toArray } from '#helpers/to-array/to-array';
     import type { Prettify } from '#types/Prettify/Prettify';
     import { local } from './local';`,
  );
  assert.deepEqual(deps.npm, ["dayjs", "zod"]);
  assert.deepEqual(deps.internal, ["Prettify", "compact", "to-array"]);
});

test("extractDependencies ignores react and node builtins", () => {
  const deps = extractDependencies(`import { useState } from 'react';\nimport path from 'node:path';`);
  assert.deepEqual(deps.npm, []);
  assert.deepEqual(deps.internal, []);
});
