import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import packageJson from "./package.json" with { type: "json" };

/*
 * Only dev and test read this config. The published build is `svelte-package`,
 * which ships the components as source — a compiled Svelte component is bound
 * to the exact runtime it was compiled against, and `svelte/internal` is not a
 * stable API.
 */
export default defineConfig({
  define: {
    __FLOW_REMOTE_SVELTE_COMPONENTS_PACKAGE_VERSION__: JSON.stringify(
      packageJson.version,
    ),
  },
  plugins: [svelte()],
  optimizeDeps: {
    include: ["svelte", "@mittwald/**/*"],
  },
});
