import { mergeConfig } from "vite";
import {
  libraryBuildChecks,
  publishedDtsOptions,
  withBundledDeclarations,
} from "../core/src/index.ts";
import dts from "unplugin-dts/vite";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import baseConfig from "./vite.config.ts";

export default mergeConfig(baseConfig, {
  build: {
    minify: false,
    sourcemap: true,
    outDir: "dist/js",
    target: "esnext",
    emptyOutDir: false,
    lib: {
      entry: {
        index: "./src/index.ts",
        RemoteRoot: "./src/components/RemoteRoot.ts",
      },
      formats: ["es"],
    },
    rolldownOptions: {
      checks: libraryBuildChecks,
      output: {
        format: "es",
        preserveModules: true,
        entryFileNames: "[name].mjs",
      },
    },
  },
  plugins: [
    externalizeDeps(),
    /*
     * `flow-components-base` is a devDependency, so its JavaScript is inlined;
     * the list's public types are built on its declarations, which have to
     * ship too.
     */
    dts(
      withBundledDeclarations(publishedDtsOptions, {
        root: import.meta.dirname,
        packages: ["@mittwald/flow-components-base"],
      }),
    ),
  ],
});
