import { defineConfig, mergeConfig } from "vite";
import dts from "vite-plugin-dts";
import baseConfig from "./vite.config";

export default defineConfig(
  mergeConfig(baseConfig, {
    plugins: [dts({ rollupTypes: true })],
    build: {
      lib: {
        entry: [
          "./src/components/Button/Button.tsx",
          "./src/components/Icon/Icon.tsx",
          "./src/components/Text/Text.tsx",
          "./src/components/RadioGroup/RadioGroup.tsx",
          "./src/components/Label/Label.tsx",
          "./src/components/Heading/Heading.tsx",
          "./src/components/Banner/Banner.tsx",
        ],
        formats: ["es"],
      },
      rollupOptions: {
        external: ["react", "react-dom"],
      },
    },
  }),
);
