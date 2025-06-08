import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/database.types.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  target: "ES2022",
  platform: "node",
}); 