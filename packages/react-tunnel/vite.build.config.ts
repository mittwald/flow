import { defineConfig, mergeConfig } from "vite";
import {
  libraryBuildChecks,
  preserveUseClientBanner,
} from "../core/src/index.ts";
import dts from "unplugin-dts/vite";
import baseConfig from "./vite.config.ts";
import { externalizeDeps } from "vite-plugin-externalize-deps";

export default defineConfig(
  mergeConfig(baseConfig, {
    plugins: [
      externalizeDeps(),
      dts({
        include: ["src"],
        outDirs: "dist/types",
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
      rolldownOptions: {
        checks: libraryBuildChecks,
        output: {
          postBanner: preserveUseClientBanner,
        },
      },
    },
  }),
);
