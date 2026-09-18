import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import defaultConfig from "../../vite.config.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const vuePackage = path.resolve(here, "../..");
const reactPackage = path.resolve(vuePackage, "../remote-react-components");

/*
 * Unlike the corpus harness next door, nothing is aliased: this one runs its
 * own scenarios rather than React's, so both sides are imported through their
 * package entry points — which is what an extension installs.
 */
export default mergeConfig(defaultConfig, {
  /*
   * The scenarios write the React side as JSX, the way an extension would.
   * Safe to set globally here: this package has no SFCs and no Vue JSX — its
   * Vue trees are plain render functions.
   */
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  resolve: {
    dedupe: ["react", "react-dom", "vue"],
  },
  server: {
    fs: {
      allow: [vuePackage, reactPackage, path.resolve(vuePackage, "../..")],
    },
  },
});
