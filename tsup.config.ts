import { defineConfig } from "tsup";
import pkg from './package.json';

export default defineConfig({
  entry: ["index.ts"],
  format: "esm",
  dts: false,
  bundle: true,
  splitting: false,
  clean: true,
  minify: true,
  sourcemap: true,
  define: {
    'process.env.VERSION': JSON.stringify(pkg.version),
  },
})
