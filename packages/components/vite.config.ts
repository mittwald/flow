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
      {
        // https://github.com/tabler/tabler-icons/issues/1233#issuecomment-2428245119
        // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
        find: "@tabler/icons-react",
        replacement: "@tabler/icons-react/dist/esm/icons/index.mjs",
      },
    ],
  },
  css: {
    modules: {
      generateScopedName: cssModuleClassNameGenerator,
    },
  },
});
