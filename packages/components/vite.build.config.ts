import { defineConfig, mergeConfig } from "vite";
import dts from "vite-plugin-dts";
import prefixer from "postcss-prefix-selector";
import baseConfig from "./vite.config.js";

export default defineConfig(
  mergeConfig(baseConfig, {
    css: {
      postcss: {
        plugins: [
          prefixer({
            prefix: ".flow",
            transform: (_, selector, prefixedSelector) => {
              if (selector === ".flow" || !selector.startsWith(".")) {
                return selector;
              }
              return prefixedSelector;
            },
          }),
        ],
      },
    },
    plugins: [dts({ rollupTypes: true })],
    build: {
      lib: {
        entry: [
          "./src/components/Slider/Slider.tsx",
          "./src/components/Button/Button.tsx",
        ],
        formats: ["es"],
      },
      rollupOptions: {
        external: ["react", "react-dom"],
      },
    },
  }),
);
