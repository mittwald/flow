import { defineConfig } from "vite";
import path from "path";
import { cssModuleClassNameGenerator } from "./dev/vite/cssModuleClassNameGenerator.ts";
import { viteI18nPlugin } from "./dev/vite/viteI18nPlugin.ts";
import { unlayeredMarkerPlugin } from "./dev/vite/unlayeredMarker.ts";
import autoprefixer from "autoprefixer";
import { lezer } from "@lezer/generator/rollup";
import sassDts from "vite-plugin-sass-dts";

export default defineConfig({
  assetsInclude: ["/sb-preview/runtime.js"],
  plugins: [
    lezer(),
    viteI18nPlugin,
    sassDts({
      esmExport: true,
    }),
  ],
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: path.resolve(import.meta.dirname) + "/src/",
      },
      {
        // https://github.com/tabler/tabler-icons/issues/1233#issuecomment-2428245119
        // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
        find: "@tabler/icons-react",
        replacement: "@tabler/icons-react/dist/esm/icons/index.mjs",
      },
    ],
  },
  optimizeDeps: {
    include: ["@mittwald/flow-icons"],
    exclude: ["@lezer/lr"],
  },
  css: {
    /*
     * Dev, Storybook and the browser tests serve component styles unlayered,
     * like the default stylesheet variant. The unlayered marker is meaningless
     * there and has to go: left in place it would turn into a real layer and
     * lose to Flow's own unlayered rules – the opposite of its purpose.
     */
    postcss: {
      /*
       * Autoprefixer sits here, not in the build config: that one merges on top
       * and concatenates the plugin list, so both pipelines prefix alike.
       */
      plugins: [unlayeredMarkerPlugin(), autoprefixer()],
    },
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
