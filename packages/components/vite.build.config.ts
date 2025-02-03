import banner from "vite-plugin-banner";
import dts from "vite-plugin-dts";
import baseConfig from "./vite.config";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import { defineConfig, mergeConfig } from "vite";

export default mergeConfig(
  baseConfig,
  defineConfig({
    experimental: {},
    build: {
      minify: false,
      sourcemap: true,
      outDir: "dist/js",
      target: "esnext",
      lib: {
        entry: {
          index: "./src/index.ts",
          internal: "./src/internal.ts",
          "flr-universal": "./src/flr-universal.ts",
          icons: "./src/internal.ts",
          nextjs: "./src/integrations/nextjs/index.ts",
          "react-hook-form": "./src/integrations/react-hook-form/index.ts",
        },
        formats: ["es"],
      },
      rollupOptions: {
        output: {
          format: "es",
          preserveModules: true,
          entryFileNames: "[name].mjs",
          assetFileNames: (assetInfo) => {
            if (assetInfo.names[0] === "flow-react-components.css") {
              return "all.css";
            }
            if (assetInfo.names[0] === "globals.css") {
              return "globals.css";
            }
            return assetInfo.names[0] ?? "undefined";
          },
        },
      },
    },
    plugins: [
      banner((filename) =>
        filename.endsWith(".mjs") && !filename.endsWith("index.mjs")
          ? '"use client"\r\n/* */'
          : "",
      ),
      externalizeDeps(),
      dts({
        include: ["src"],
        outDir: "dist/types",
      }),
    ],
  }),
);
