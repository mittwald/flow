import dts from "unplugin-dts/vite";
import baseConfig from "./vite.config";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import { defineConfig, mergeConfig } from "vite";
import { flowComponentsLayerPlugin } from "./dev/vite/flowComponentsLayerPlugin.ts";
import { layerOrderPlugin } from "./dev/vite/layerOrderPlugin.ts";
import { stylesheetVariantsPlugin } from "./dev/vite/stylesheetVariantsPlugin.ts";
import { preserveUseClientBanner } from "../core";

export default mergeConfig(
  baseConfig,
  defineConfig({
    experimental: {},
    build: {
      minify: false,
      sourcemap: true,
      outDir: "dist",
      target: "esnext",
      cssMinify: "esbuild",
      lib: {
        entry: {
          default: "./src/index/default.ts",
          internal: "./src/index/internal.ts",
          "flr-universal": "./src/index/flr-universal.ts",
          nextjs: "./src/integrations/nextjs/index.ts",
          "react-hook-form": "./src/integrations/react-hook-form/index.ts",
          "@mittwald/password-tools-js":
            "./src/integrations/@mittwald/password-tools-js/index.ts",
          globals: "./src/styles/index.ts",
        },
        formats: ["es"],
      },
      emptyOutDir: false,
      rolldownOptions: {
        output: {
          postBanner: preserveUseClientBanner,
          format: "es",
          preserveModules: true,
          entryFileNames: "js/[name].mjs",
          assetFileNames: (assetInfo) => {
            if (assetInfo.names[0] === "flow-react-components.css") {
              return "css/all.css";
            }
            if (assetInfo.names[0] === "globals.css") {
              return "css/globals.css";
            }
            return assetInfo.names[0] ?? `undefined`;
          },
        },
      },
    },
    /*
     * Merged on top of the dev config, so its marker plugin stays in the
     * pipeline. That is safe: where this plugin is present, the marker plugin
     * steps aside and leaves the markers for it to segment at.
     */
    css: {
      postcss: {
        plugins: [flowComponentsLayerPlugin()],
      },
    },
    plugins: [
      layerOrderPlugin(),
      stylesheetVariantsPlugin(),
      externalizeDeps({
        except: ["@mittwald/flow-design-tokens/**/*", "@mittwald/flow-core"],
      }),
      dts({
        include: ["src"],
        outDirs: "dist/types",
      }),
    ],
  }),
);
