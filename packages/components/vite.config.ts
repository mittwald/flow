import { defineConfig } from "vite";
import postcssNesting from "postcss-nesting";
import { cssModuleClassNameGenerator } from "./dev/cssModuleClassNameGenerator";

export default defineConfig({
  resolve: {
    alias: {
      "@/": "/src/",
    },
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
