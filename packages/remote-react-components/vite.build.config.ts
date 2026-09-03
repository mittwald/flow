import preserveDirectives from "rollup-preserve-directives";
import { mergeConfig } from "vite";
import { preserveUseClientBanner } from "../core";
import dts from "unplugin-dts/vite";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import baseConfig from "./vite.config";

export default mergeConfig(baseConfig, {
  build: {
    minify: false,
    sourcemap: true,
    outDir: "dist/js",
    target: "esnext",
    emptyOutDir: false,
    lib: {
      entry: {
        index: "./src/index.ts",
        RemoteRoot: "./src/components/RemoteRoot.tsx",
        "react-hook-form": "./src/integrations/react-hook-form/index.ts",
      },
      formats: ["es"],
    },
    rolldownOptions: {
      output: {
        format: "es",
        preserveModules: true,
        entryFileNames: "[name].mjs",
        postBanner: preserveUseClientBanner,
      },
    },
  },
  plugins: [
    preserveDirectives(),
    externalizeDeps(),
    dts({
      include: ["src"],
      outDirs: "dist/types",
    }),
  ],
});
