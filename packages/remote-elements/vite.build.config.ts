import { defineConfig, mergeConfig } from "vite";
import dts from "vite-plugin-dts";
import baseConfig from "./vite.config";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import preserveDirectives from "rollup-preserve-directives";

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      preserveDirectives(),
      externalizeDeps(),
      dts({
        include: ["src"],
        outDir: "dist/types",
      }),
    ],
    build: {
      emptyOutDir: false,
      lib: {
        entry: {
          index: "./src/index.ts",
        },
        formats: ["es"],
      },
    },
  }),
);
