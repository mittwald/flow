import { defineConfig, mergeConfig } from "vite";
import { preserveUseClientBanner, publishedDtsOptions } from "../core";
import dts from "unplugin-dts/vite";
import baseConfig from "./vite.config";
import { externalizeDeps } from "vite-plugin-externalize-deps";

export default defineConfig(
  mergeConfig(baseConfig, {
    plugins: [externalizeDeps(), dts(publishedDtsOptions)],
    build: {
      emptyOutDir: false,
      lib: {
        entry: {
          index: "./src/index.ts",
        },
        formats: ["es"],
      },
      rolldownOptions: {
        output: {
          postBanner: preserveUseClientBanner,
        },
      },
    },
  }),
);
