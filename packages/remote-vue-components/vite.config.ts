import path from "path";
import { defineConfig } from "vite";
import packageJson from "./package.json" with { type: "json" };

export default defineConfig({
  define: {
    __FLOW_REMOTE_VUE_COMPONENTS_PACKAGE_VERSION__: JSON.stringify(
      packageJson.version,
    ),
    /*
     * Vue's esm-bundler build expects the bundler to define these. They only
     * affect tree-shaking, but Vue warns on every run without them.
     */
    __VUE_OPTIONS_API__: "true",
    __VUE_PROD_DEVTOOLS__: "false",
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
  },
  optimizeDeps: {
    include: ["vue", "@mittwald/**/*"],
  },
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: path.resolve(import.meta.dirname) + "/src/",
      },
    ],
  },
});
