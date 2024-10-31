import type { LibraryOptions, PluginOption } from "vite";
import { defineConfig, mergeConfig } from "vite";
import banner from "vite-plugin-banner";
import dts from "vite-plugin-dts";
import baseConfig from "./vite.config";
import { externalizeDeps } from "vite-plugin-externalize-deps";

interface Options {
  mode: "cssChunks" | "default";
}

export const buildConfig = (opts: Options) => {
  const { mode } = opts;
  const outDir = mode === "cssChunks" ? "dist/css" : "dist/js";

  const plugins: PluginOption[] =
    mode === "cssChunks"
      ? []
      : [
          banner((filename) =>
            filename.endsWith(".js") ? '"use client"\r\n/* */' : "",
          ),
          externalizeDeps(),
          dts({
            include: ["src"],
            outDir: "dist/js/types",
          }),
        ];

  const cssCodeSplit = mode === "cssChunks";

  const entryPoints: LibraryOptions["entry"] = {
    UserMenu: "./src/components/UserMenu/index.ts",
  };

  return defineConfig(
    mergeConfig(baseConfig, {
      plugins,
      build: {
        outDir,
        cssCodeSplit,
        lib: {
          entry: entryPoints,
          formats: ["es"],
        },
        rollupOptions: {
          output: {
            assetFileNames: (assetInfo: { name: string }) => {
              if (assetInfo.name === "style.css") {
                return "all.css";
              }
              if (assetInfo.name === "globals.css") {
                return "globals.css";
              }
              return assetInfo.name;
            },
          },
        },
      },
    }),
  );
};
