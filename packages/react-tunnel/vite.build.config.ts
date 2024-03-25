import { defineConfig, mergeConfig } from "vite";
import banner from "vite-plugin-banner";
import dts from "vite-plugin-dts";
import baseConfig from "./vite.config";
import { externalizeDeps } from "vite-plugin-externalize-deps";

export default defineConfig(
  mergeConfig(baseConfig, {
    plugins: [
      banner((filename) =>
        filename.endsWith(".js") ? '"use client"\r\n/* */' : "",
      ),
      externalizeDeps(),
      dts({
        include: ["src"],
        outDir: "dist/types",
      }),
    ],
    build: {
      lib: {
        entry: {
          index: "./src/index.ts",
        },
        formats: ["es"],
      },
    },
  }),
);
