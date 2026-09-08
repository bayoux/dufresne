#!/usr/bin/env node
// Kept deliberately tiny and import-free (besides bare Node globals): this
// check has to run and print a clear message *before* anything that could
// throw on an old Node ever loads — including `node:util`'s `styleText`/
// `parseArgs`, which don't exist pre-22.13. A dynamic import() is a real
// deferral point (unlike a static import, which ESM hoists and evaluates
// regardless of where it's written), so the rest of the CLI — main.ts and
// everything it pulls in — only loads once the version is known-good.
const REQUIRED = { major: 22, minor: 18 };
const [major = 0, minor = 0] = process.versions.node.split(".").map(Number);

if (major < REQUIRED.major || (major === REQUIRED.major && minor < REQUIRED.minor)) {
  console.error(
    `dufresne requires Node.js >= ${REQUIRED.major}.${REQUIRED.minor} ` +
      `(you're running ${process.versions.node}). Update Node and try again: https://nodejs.org/`,
  );
  process.exit(1);
}

await import("./main.ts");
