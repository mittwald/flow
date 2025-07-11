import banner from "vite-plugin-banner";
import dts from "vite-plugin-dts";
import baseConfig from "./vite.config";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import { defineConfig, mergeConfig } from "vite";
import { nodePolyfills as viteNodePolyfills } from "vite-plugin-node-polyfills";

export default mergeConfig(
  baseConfig,
  defineConfig({
    experimental: {},
    build: {
      minify: false,
      sourcemap: true,
      outDir: "dist",
      target: "esnext",
      cssMinify: "esbuild",
      lib: {
        entry: {
          default: "./src/index/default.ts",
          internal: "./src/index/internal.ts",
          "flr-universal": "./src/index/flr-universal.ts",
          nextjs: "./src/integrations/nextjs/index.ts",
          "react-hook-form": "./src/integrations/react-hook-form/index.ts",
          "@mittwald/password-tools-js":
            "./src/integrations/@mittwald/password-tools-js/index.ts",
          globals: "./src/styles/index.ts",
        },
        formats: ["es"],
      },
      emptyOutDir: false,
      rollupOptions: {
        output: {
          format: "es",
          preserveModules: true,
          entryFileNames: "js/[name].mjs",
          assetFileNames: (assetInfo) => {
            if (assetInfo.names[0] === "flow-react-components.css") {
              return "css/all.css";
            }
            if (assetInfo.names[0] === "globals.css") {
              return "css/globals.css";
            }
            return assetInfo.names[0] ?? `undefined`;
          },
        },
      },
    },
    plugins: [
      viteNodePolyfills({
        protocolImports: true,
      }),
      banner((filename) =>
        filename.endsWith(".mjs") && !filename.endsWith("index.mjs")
          ? '"use client"\r\n/* */'
          : "",
      ),
      externalizeDeps({
        except: ["@mittwald/flow-design-tokens/css", "@mittwald/flow-core"],
      }),
      dts({
        include: ["src"],
        outDir: "dist/types",
      }),
    ],
  }),
);
