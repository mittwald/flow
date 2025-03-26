import { mergeConfig } from "vite";
import baseConfig from "./vite.config";

export default mergeConfig(baseConfig, {
  extends: "vite.config.ts",
  cacheDir: "node_modules/.vite-browser",
});
