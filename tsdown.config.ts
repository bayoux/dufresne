import { readFileSync } from "node:fs";
import { defineConfig } from "tsdown";

const { version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as { version: string };

export default defineConfig({
  entry: ["cli/index.ts"],
  format: "esm",
  target: "node22",
  dts: false,
  clean: true,
  minify: true,
  // No sourcemaps in the published bundle: they were ~70% of the unpacked
  // package (map for a ~26kB chunk was ~87kB) and buy little in practice —
  // local dev already runs unbundled source directly (`pnpm start`/`dev`
  // execute cli/index.ts as-is), so nothing here is ever debugged through
  // the minified dist/ output.
  sourcemap: false,
  define: {
    "process.env.VERSION": JSON.stringify(version),
  },
});
