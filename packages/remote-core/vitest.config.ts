import defaultConfig from "./vite.config";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";

export default mergeConfig(
  {
    ...defaultConfig,
    plugins: [],
  },
  defineConfig({
    test: {
      environment: "happy-dom",
      globals: true,
    },
  }),
);
