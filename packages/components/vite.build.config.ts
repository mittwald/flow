import { defineConfig, mergeConfig } from "vite";
import dts from "vite-plugin-dts";
import baseConfig from "./vite.config";

export default defineConfig(
  mergeConfig(baseConfig, {
    plugins: [dts({ rollupTypes: true })],
    build: {
      lib: {
        entry: {
          Button: "./src/components/Button",
          Content: "./src/components/Content",
          Icon: "./src/components/Icon",
          Label: "./src/components/Label",
          Navigation: "./src/components/Navigation",
          RadioGroup: "./src/components/RadioGroup",
          Text: "./src/components/Text",
        },
        formats: ["es"],
      },
      rollupOptions: {
        external: ["react", "react-dom"],
      },
    },
  }),
);
