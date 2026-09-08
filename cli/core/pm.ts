import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export type PackageManager = "pnpm" | "yarn" | "bun" | "npm";

const KNOWN: PackageManager[] = ["pnpm", "yarn", "bun", "npm"];

/**
 * Detects the package manager for `cwd`, preferring the canonical
 * `packageManager` field, then lockfiles, then npm.
 */
export function detectPackageManager(cwd: string): PackageManager {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf-8")) as {
      packageManager?: string;
    };
    const named = pkg.packageManager?.split("@")[0]?.trim();
    if (named && (KNOWN as string[]).includes(named)) return named as PackageManager;
  } catch {
    // no package.json / unreadable — fall through to lockfile sniffing
  }

  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(cwd, "bun.lockb")) || fs.existsSync(path.join(cwd, "bun.lock"))) {
    return "bun";
  }
  return "npm";
}

export function installPackages(pm: PackageManager, packages: string[], cwd: string): void {
  if (!packages.length) return;

  const args = pm === "npm" ? ["install", ...packages] : ["add", ...packages];
  const result = spawnSync(pm, args, { cwd, stdio: "inherit" });

  if (result.status !== 0) {
    throw new Error(`\`${pm} ${args.join(" ")}\` failed`);
  }
}
