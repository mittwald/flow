import preserveDirectives from "rollup-preserve-directives";
import { defineConfig, mergeConfig } from "vite";
import dts from "unplugin-dts/vite";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import { libraryBuildChecks } from "../core/src/index.ts";
import baseConfig from "./vite.config.ts";

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      preserveDirectives(),
      externalizeDeps(),
      dts({
        include: ["src"],
        outDirs: "dist/types",
      }),
    ],
    build: {
      minify: false,
      sourcemap: true,
      outDir: "dist",
      target: "esnext",
      emptyOutDir: false,
      lib: {
        entry: {
          index: "./src/index.ts",
          "index-node": "./src/index-node.ts",
          "index-browser": "./src/index-browser.ts",
          react: "./src/react/index.ts",
          i18next: "./src/integrations/i18next/index.ts",
        },
        formats: ["es"],
      },
      rollupOptions: {
        checks: libraryBuildChecks,
        output: {
          format: "es",
          preserveModules: true,
          entryFileNames: "js/[name].mjs",
        },
      },
    },
  }),
);
