// Swaps README.md for the short scripts/npm-readme.md right before npm packs
// the tarball (`prepack`), then restores the full README right after
// (`postpack`) — so GitHub always sees the full README.md (it's what's
// committed) while the published package ships the short one. The source for
// the short version deliberately does NOT live at the repo root as
// `README*`: npm always bundles any such file regardless of `files`/
// `.npmignore`, which would otherwise ship both versions at once. The backup
// lives outside the repo (os.tmpdir()), so an interrupted run leaves the
// working tree merely *dirty* (visible in `git status`, trivially fixed with
// `git checkout -- README.md`), never silently wrong.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const README = path.join(ROOT, "README.md");
const SHORT_README = path.join(ROOT, "scripts/npm-readme.md");
const BACKUP = path.join(os.tmpdir(), "dufresne-readme-full.md.bak");

const mode = process.argv[2];

if (mode === "swap") {
  fs.copyFileSync(README, BACKUP);
  fs.copyFileSync(SHORT_README, README);
  console.log("README.md swapped to the short npm version for packing.");
} else if (mode === "restore") {
  if (fs.existsSync(BACKUP)) {
    fs.copyFileSync(BACKUP, README);
    fs.rmSync(BACKUP);
    console.log("README.md restored to the full version.");
  } else {
    console.warn("No README backup found — nothing to restore (was `swap` run first?).");
  }
} else {
  console.error("Usage: node scripts/pack-readme.ts <swap|restore>");
  process.exit(1);
}
