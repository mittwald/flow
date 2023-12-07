import { defineConfig, mergeConfig } from "vite";
import dts from "vite-plugin-dts";
import baseConfig from "./vite.config";

export default defineConfig(
  mergeConfig(baseConfig, {
    plugins: [dts({ rollupTypes: true })],
    build: {
      lib: {
        entry: [
          "./src/components/Slider/Slider.tsx",
          "./src/components/Button/Button.tsx",
          "./src/components/Icon/Icon.tsx",
        ],
        formats: ["es"],
      },
      rollupOptions: {
        external: ["react", "react-dom"],
      },
    },
  }),
);
