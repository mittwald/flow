import preserveDirectives from "rollup-preserve-directives";
import { defineConfig, mergeConfig } from "vite";
import dts from "unplugin-dts/vite";
import { preserveUseClientBanner, publishedDtsOptions } from "../core";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import baseConfig from "./vite.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    build: {
      minify: false,
      sourcemap: true,
      outDir: "dist/js",
      target: "esnext",
      emptyOutDir: false,
      lib: {
        entry: {
          index: "./src/index.ts",
        },
        formats: ["es"],
      },
      rolldownOptions: {
        output: {
          postBanner: preserveUseClientBanner,
          format: "es",
          preserveModules: true,
          entryFileNames: "[name].mjs",
        },
      },
    },
    plugins: [
      preserveDirectives(),
      externalizeDeps(),
      dts(publishedDtsOptions),
    ],
  }),
);
