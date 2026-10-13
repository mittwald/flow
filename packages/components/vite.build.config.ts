import dts from "unplugin-dts/vite";
import baseConfig from "./vite.config.ts";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import { defineConfig, mergeConfig } from "vite";
import { flowComponentsLayerPlugin } from "./dev/vite/flowComponentsLayerPlugin.ts";
import { layerOrderPlugin } from "./dev/vite/layerOrderPlugin.ts";
import { stylesheetVariantsPlugin } from "./dev/vite/stylesheetVariantsPlugin.ts";
import {
  libraryBuildChecks,
  preserveUseClientBanner,
  publishedDtsOptions,
  withBundledDeclarations,
} from "../core/src/index.ts";

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
          tunnel: "./src/index/tunnel.ts",
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
        checks: libraryBuildChecks,
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
        /*
         * Bundled, not externalized. `flow-core` and `flow-components-base`
         * are private workspace packages that never reach npm, so an import of
         * one would not resolve for a consumer; the design tokens are a
         * devDependency whose JSON the styles and themes compile in.
         */
        except: [
          "@mittwald/flow-design-tokens/**/*",
          "@mittwald/flow-core",
          "@mittwald/flow-components-base",
        ],
      }),
      /*
       * The JavaScript of `flow-components-base` is inlined above; its
       * declarations have to travel as well, or every public type built on the
       * list's model names a package the consumer cannot install.
       */
      dts(
        withBundledDeclarations(publishedDtsOptions, {
          root: import.meta.dirname,
          packages: ["@mittwald/flow-components-base"],
        }),
      ),
    ],
  }),
);
