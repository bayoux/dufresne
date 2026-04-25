import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  format: "esm",
  dts: false,
  bundle: true,
  splitting: false,
  clean: true,
  minify: true,
  sourcemap: true,
})
