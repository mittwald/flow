import { defineConfig, mergeConfig } from "vite";
import { viteBannerPlugin } from "../core";
import dts from "unplugin-dts/vite";
import baseConfig from "./vite.config";
import { externalizeDeps } from "vite-plugin-externalize-deps";

export default defineConfig(
  mergeConfig(baseConfig, {
    plugins: [
      viteBannerPlugin((filename) =>
        filename.endsWith(".js") ? '"use client"\r\n/* */' : "",
      ),
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
    },
  }),
);
