import preserveDirectives from "rollup-preserve-directives";
import { defineConfig, mergeConfig } from "vite";
import dts from "unplugin-dts/vite";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import baseConfig from "./vite.config";
import { publishedDtsOptions } from "../core";

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      preserveDirectives(),
      externalizeDeps(),
      dts(publishedDtsOptions),
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
        output: {
          format: "es",
          preserveModules: true,
          entryFileNames: "js/[name].mjs",
        },
      },
    },
  }),
);
