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
      sourcemap: true,
      outDir: "dist/js",
      lib: {
        entry: {
          index: "./src/index.ts",
          internal: "./src/internal.ts",
          globals: "./src/styles/index.ts",
          hooks: "./src/lib/hooks/index.ts",
          nextjs: "./src/integrations/nextjs/index.ts",
          "react-hook-form/Form":
            "./src/integrations/react-hook-form/components/Form/index.ts",
          "react-hook-form/Field":
            "./src/integrations/react-hook-form/components/Field/index.ts",
        },
        formats: ["es"],
      },
      rollupOptions: {
        output: {
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
        filename.endsWith(".js") ? '"use client"\r\n/* */' : "",
      ),
      externalizeDeps(),
      dts({
        include: ["src"],
        outDir: "dist/types",
      }),
    ],
  }),
);
