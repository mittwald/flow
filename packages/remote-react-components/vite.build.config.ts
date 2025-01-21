import banner from "vite-plugin-banner";
import { defineConfig, mergeConfig } from "vite";
import dts from "vite-plugin-dts";
import baseConfig from "./vite.config";
import { externalizeDeps } from "vite-plugin-externalize-deps";

export default mergeConfig(
  baseConfig,
  defineConfig({
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
          Icons: "./src/Icons.ts",
          hooks: "./src/hooks.ts",
          controller: "./src/controller.ts",
          "react-hook-form": "./src/integrations/react-hook-form/index.ts",
        },
        formats: ["es"],
      },
    },
  }),
);
