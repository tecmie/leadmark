import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  target: "node18",
  platform: "node",
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
}); 