import { defineConfig } from "vite";
import postcssNesting from "postcss-nesting";
import { cssModuleClassNameGenerator } from "./dev/cssModuleClassNameGenerator";
import path from "path";
import viteI18nPlugin from "./dev/viteI18nPlugin";
import { nodePolyfills as viteNodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  assetsInclude: ["/sb-preview/runtime.js"],
  plugins: [
    viteNodePolyfills({
      protocolImports: true,
    }),
    viteI18nPlugin,
  ],
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: path.resolve(__dirname) + "/src/",
      },
    ],
  },
  css: {
    postcss: {
      plugins: [postcssNesting],
    },
    modules: {
      generateScopedName: cssModuleClassNameGenerator,
    },
  },
});
