import preserveDirectives from "rollup-preserve-directives";
import { defineConfig, mergeConfig } from "vite";
import { preserveUseClientBanner } from "../core";
import dts from "unplugin-dts/vite";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import baseConfig from "./vite.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [
      preserveDirectives(),
      externalizeDeps({
        except: [/^@mittwald\/remote-dom-react(?:\/.+)?$/],
      }),
      dts({
        include: ["src"],
        outDirs: "dist/types",
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
      rolldownOptions: {
        output: {
          postBanner: preserveUseClientBanner,
          preserveModules: true,
          entryFileNames: "[name].mjs",
        },
      },
    },
  }),
);
