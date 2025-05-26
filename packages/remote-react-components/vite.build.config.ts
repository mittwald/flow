import preserveDirectives from "rollup-preserve-directives";
import { mergeConfig } from "vite";
import banner from "vite-plugin-banner";
import dts from "vite-plugin-dts";
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
    rollupOptions: {
      output: {
        format: "es",
        preserveModules: true,
        entryFileNames: "[name].mjs",
      },
    },
  },
  plugins: [
    preserveDirectives(),
    banner((filename) =>
      filename.endsWith(".mjs") && !filename.endsWith("index.mjs")
        ? '"use client"\r\n/* */'
        : "",
    ),
    externalizeDeps(),
    dts({
      include: ["src"],
      outDir: "dist/types",
    }),
  ],
});
