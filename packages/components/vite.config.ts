import { defineConfig } from "vite";
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
    modules: {
      generateScopedName: cssModuleClassNameGenerator,
    },
  },
});
