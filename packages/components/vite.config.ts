import { defineConfig } from "vite";
import postcssNesting from "postcss-nesting";
import { cssModuleClassNameGenerator } from "./dev/cssModuleClassNameGenerator";
import path from "path";
import viteI18nPlugin from "./dev/viteI18nPlugin";

export default defineConfig({
  plugins: [viteI18nPlugin],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
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
  build: {
    emptyOutDir: false,
  },
});
