import preserveDirectives from "rollup-preserve-directives";
import { defineConfig, mergeConfig } from "vite";
import dts from "unplugin-dts/vite";
import {
  libraryBuildChecks,
  preserveUseClientBanner,
} from "../core/src/index.ts";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import baseConfig from "./vite.config.ts";

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
        checks: libraryBuildChecks,
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
      dts({
        include: ["src"],
        outDirs: "dist/types",
      }),
    ],
  }),
);
