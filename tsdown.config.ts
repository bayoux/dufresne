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
  sourcemap: true,
  define: {
    "process.env.VERSION": JSON.stringify(version),
  },
});
