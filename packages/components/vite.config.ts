import { defineConfig } from "vite";
import path from "path";
import { cssModuleClassNameGenerator } from "./dev/vite/cssModuleClassNameGenerator";
import { viteI18nPlugin } from "./dev/vite/viteI18nPlugin";
import { lezer } from "@lezer/generator/rollup";

export default defineConfig({
  assetsInclude: ["/sb-preview/runtime.js"],
  plugins: [
    lezer({
      // lezer don't provide a default export - this dirty workaround creates
      // a default export - so it works with the default import within vite
      exportName:
        "defaultExportHackSeeDefinitionInViteConfigTs = null; export default LRParser.deserialize({ //",
    }),
    viteI18nPlugin,
  ],
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
    preprocessorOptions: {
      scss: {
        loadPaths: ["./src"],
      },
    },
  },
});
