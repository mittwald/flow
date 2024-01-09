import { defineConfig, mergeConfig } from "vite";
import dts from "vite-plugin-dts";
import baseConfig from "./vite.config";

export default defineConfig(
  mergeConfig(baseConfig, {
    plugins: [dts({ rollupTypes: true })],
    build: {
      lib: {
        entry: {
          Button: "./src/components/Button/index.ts",
          Content: "./src/components/Content/index.ts",
          Icon: "./src/components/Icon/index.ts",
          Label: "./src/components/Label/index.ts",
          Navigation: "./src/components/Navigation/index.ts",
          NavigationItem:
            "./src/components/Navigation/components/NavigationItem/index.ts",
          RadioGroup: "./src/components/RadioGroup/index.ts",
          Radio: "./src/components/RadioGroup/components/Radio/index.ts",
          Text: "./src/components/Text/index.ts",
          Link: "./src/components/Link/index.ts",
        },
        formats: ["es"],
      },
      rollupOptions: {
        external: ["react", "react-dom"],
      },
    },
  }),
);
