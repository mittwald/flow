import preserveDirectives from "rollup-preserve-directives";
import { defineConfig, mergeConfig } from "vite";
import dts from "unplugin-dts/vite";
import { viteBannerPlugin } from "../core";
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
      rollupOptions: {
        output: {
          format: "es",
          preserveModules: true,
          entryFileNames: "[name].mjs",
        },
      },
    },
    plugins: [
      preserveDirectives(),
      viteBannerPlugin((filename) =>
        filename.endsWith(".mjs") && !filename.endsWith("index.mjs")
          ? '"use client"\r\n/* */'
          : "",
      ),
      externalizeDeps(),
      dts({
        include: ["src"],
        outDirs: "dist/types",
      }),
    ],
  }),
);
