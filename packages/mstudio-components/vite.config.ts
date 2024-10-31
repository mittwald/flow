import { defineConfig } from "vite";
import postcssNesting from "postcss-nesting";
import { cssModuleClassNameGenerator } from "./dev/cssModuleClassNameGenerator";
import path from "path";

export default defineConfig({
  assetsInclude: ["/sb-preview/runtime.js"],
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
