// End-to-end tests for the CLI commands themselves — the orchestration in
// cli/commands/*.ts, which the unit tests under cli/core and cli/lib don't
// exercise. Each test spawns `cli/index.ts` (native TS, no build needed) as a
// real subprocess against a fresh temp directory and this repo's own
// registry.json (local path — offline, no network, no live-data drift).
import assert from "node:assert/strict";
import { type SpawnSyncReturns, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "..", "..");
const CLI = path.join(ROOT, "cli", "index.ts");
const REGISTRY = path.join(ROOT, "registry.json");

function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, "");
}

function tmpProject(t: TestContext): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dufresne-cli-it-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

interface Run {
  status: number | null;
  stdout: string;
  stderr: string;
}

function run(args: string[], cwd: string): Run {
  const result: SpawnSyncReturns<string> = spawnSync(
    process.execPath,
    [CLI, ...args, "--registry", REGISTRY],
    { cwd, encoding: "utf-8", input: "", timeout: 20_000 },
  );
  if (result.error) throw result.error;
  return {
    status: result.status,
    stdout: stripAnsi(result.stdout ?? ""),
    stderr: stripAnsi(result.stderr ?? ""),
  };
}

test("--version prints a non-empty version", (t) => {
  const { status, stdout } = run(["--version"], tmpProject(t));
  assert.equal(status, 0);
  assert.match(stdout.trim(), /^(dev|\d+\.\d+\.\d+)$/);
});

test("--help lists every command", (t) => {
  const { status, stdout } = run(["--help"], tmpProject(t));
  assert.equal(status, 0);
  for (const cmd of ["init", "add", "update", "remove", "sync", "list", "info", "doctor"]) {
    assert.match(stdout, new RegExp(`\\b${cmd}\\b`));
  }
});

test("add writes the item file and a barrel export", (t) => {
  const cwd = tmpProject(t);
  const { status } = run(["add", "chunk", "--yes"], cwd);

  assert.equal(status, 0);
  const file = path.join(cwd, "utils", "chunk.ts");
  assert.ok(fs.existsSync(file), "utils/chunk.ts should exist");
  assert.match(fs.readFileSync(file, "utf-8"), /export function chunk/);
  assert.match(fs.readFileSync(path.join(cwd, "utils", "index.ts"), "utf-8"), /from '\.\/chunk'/);
});

test("add resolves and installs a real internal dependency", (t) => {
  // sample.ts imports shuffle via #utils/shuffle/shuffle — this is the
  // concrete regression test for that cross-item import actually resolving.
  const cwd = tmpProject(t);
  const { status } = run(["add", "sample", "--yes"], cwd);

  assert.equal(status, 0);
  assert.ok(fs.existsSync(path.join(cwd, "utils", "sample.ts")));
  assert.ok(fs.existsSync(path.join(cwd, "utils", "shuffle.ts")), "shuffle should be pulled in");
});

test("add --dry-run writes nothing", (t) => {
  const cwd = tmpProject(t);
  const { status, stdout } = run(["add", "chunk", "--dry-run"], cwd);

  assert.equal(status, 0);
  assert.match(stdout, /Would write/);
  assert.equal(fs.existsSync(path.join(cwd, "utils")), false);
});

test("add with an unknown name fails gracefully instead of crashing", (t) => {
  const cwd = tmpProject(t);
  const { status, stdout } = run(["add", "zzz-not-a-real-item", "--yes"], cwd);

  assert.equal(status, 0);
  assert.match(stdout, /is not in the registry/);
  assert.equal(fs.existsSync(path.join(cwd, "utils")), false);
});

test("add with no arguments and no TTY input does not hang", (t) => {
  const cwd = tmpProject(t);
  const { status } = run(["add"], cwd);
  assert.equal(status, 0);
});

test("list --json --category filters and returns valid JSON", (t) => {
  const { status, stdout } = run(["list", "--json", "--category", "array"], tmpProject(t));

  assert.equal(status, 0);
  const items = JSON.parse(stdout) as Array<{ name: string; category: string }>;
  assert.ok(items.length > 0);
  assert.ok(items.every((i) => i.category === "array"));
  assert.ok(items.some((i) => i.name === "chunk"));
});

test("info --json returns the item as JSON", (t) => {
  const { status, stdout } = run(["info", "chunk", "--json"], tmpProject(t));

  assert.equal(status, 0);
  const item = JSON.parse(stdout) as { name: string; type: string };
  assert.equal(item.name, "chunk");
  assert.equal(item.type, "util");
});

test("info --json on an unknown name exits 1 with an error payload", (t) => {
  const { status, stderr } = run(["info", "zzz-not-a-real-item", "--json"], tmpProject(t));

  assert.equal(status, 1);
  const payload = JSON.parse(stderr) as { error: string };
  assert.match(payload.error, /is not in the registry/);
});

test("update restores a locally-modified file to the registry's version", (t) => {
  const cwd = tmpProject(t);
  run(["add", "chunk", "--yes"], cwd);

  const file = path.join(cwd, "utils", "chunk.ts");
  const original = fs.readFileSync(file, "utf-8");
  fs.appendFileSync(file, "\n// locally modified\n");
  assert.notEqual(fs.readFileSync(file, "utf-8"), original);

  const { status } = run(["update", "chunk", "--yes"], cwd);

  assert.equal(status, 0);
  assert.equal(fs.readFileSync(file, "utf-8"), original);
});

test("remove deletes the file and its barrel export", (t) => {
  const cwd = tmpProject(t);
  run(["add", "chunk", "clamp", "--yes"], cwd);

  const { status } = run(["remove", "chunk", "--yes"], cwd);

  assert.equal(status, 0);
  assert.equal(fs.existsSync(path.join(cwd, "utils", "chunk.ts")), false);
  assert.ok(fs.existsSync(path.join(cwd, "utils", "clamp.ts")), "clamp should be untouched");
  const barrel = fs.readFileSync(path.join(cwd, "utils", "index.ts"), "utf-8");
  assert.doesNotMatch(barrel, /from '\.\/chunk'/);
  assert.match(barrel, /from '\.\/clamp'/);
});

test("sync installs exactly the set declared in dufresne.json", (t) => {
  const cwd = tmpProject(t);
  fs.writeFileSync(
    path.join(cwd, "dufresne.json"),
    JSON.stringify(
      {
        ts: true,
        case: "kebab",
        barrel: true,
        comments: true,
        items: ["chunk", "clamp"],
        aliases: { utils: "./utils", helpers: "./helpers", types: "./types" },
        paths: { utils: "utils", helpers: "helpers", types: "types" },
      },
      null,
      2,
    ),
  );

  const { status } = run(["sync", "--yes"], cwd);

  assert.equal(status, 0);
  assert.ok(fs.existsSync(path.join(cwd, "utils", "chunk.ts")));
  assert.ok(fs.existsSync(path.join(cwd, "utils", "clamp.ts")));
});

test("sync with no dufresne.json exits cleanly instead of guessing", (t) => {
  const { status, stdout } = run(["sync", "--yes"], tmpProject(t));

  assert.equal(status, 0);
  assert.match(stdout, /dufresne init/);
});

test("doctor passes on a clean project", (t) => {
  const { status, stdout } = run(["doctor"], tmpProject(t));

  assert.equal(status, 0);
  assert.match(stdout, /Registry reachable/);
  assert.match(stdout, /All good/);
});

test("doctor warns about aliased path/alias conflicts without failing", (t) => {
  const cwd = tmpProject(t);
  fs.writeFileSync(
    path.join(cwd, "dufresne.json"),
    JSON.stringify({
      paths: { utils: "src/shared", helpers: "src/shared", types: "src/types" },
      aliases: { utils: "@/shared", helpers: "@/shared", types: "@/types" },
    }),
  );

  const { status, stdout } = run(["doctor"], cwd);

  assert.equal(status, 0);
  assert.match(stdout, /paths\.utils and paths\.helpers/);
  assert.match(stdout, /aliases\.utils and aliases\.helpers/);
});
