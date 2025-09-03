import preserveDirectives from "rollup-preserve-directives";
import { defineConfig, mergeConfig } from "vite";
import banner from "vite-plugin-banner";
import dts from "vite-plugin-dts";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import baseConfig from "./vite.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      preserveDirectives(),
      banner((filename) =>
        filename.endsWith(".mjs") ? '"use client"\r\n/* */' : "",
      ),
      externalizeDeps(),
      dts({
        include: ["src"],
        outDir: "dist/types",
      }),
    ],
    build: {
      minify: false,
      sourcemap: true,
      outDir: "dist/js",
      target: "esnext",
      emptyOutDir: false,
      lib: {
        entry: {
          index: "./src/index.ts",
          RemoteRenderer: "./src/RemoteRenderer.tsx",
        },
        formats: ["es"],
      },
      rollupOptions: {
        output: {
          preserveModules: true,
          entryFileNames: "[name].mjs",
        },
      },
    },
  }),
);
