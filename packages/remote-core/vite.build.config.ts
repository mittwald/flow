import preserveDirectives from "rollup-preserve-directives";
import { defineConfig, mergeConfig } from "vite";
import dts from "vite-plugin-dts";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import baseConfig from "./vite.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      preserveDirectives(),
      externalizeDeps({
        except: ["@mittwald/flow-core"],
      }),
      dts({
        include: ["src"],
        outDir: "dist/types",
      }),
    ],

    build: {
      minify: false,
      sourcemap: true,
      outDir: "dist",
      target: "esnext",
      lib: {
        entry: {
          index: "./src/index.ts",
          "index-node": "./src/index-node.ts",
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
