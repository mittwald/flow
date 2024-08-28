import { defineConfig } from "vite";
import postcssNesting from "postcss-nesting";
import { cssModuleClassNameGenerator } from "./dev/cssModuleClassNameGenerator";
import path from "path";
import viteI18nPlugin from "./dev/viteI18nPlugin";

export default defineConfig({
  assetsInclude: ["/sb-preview/runtime.js"],
  plugins: [viteI18nPlugin],
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
      // @todo: fix this type cast
      plugins: [postcssNesting as never],
    },
    modules: {
      generateScopedName: cssModuleClassNameGenerator,
    },
  },
});
