import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import defaultConfig from "../../vite.config.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const vuePackage = path.resolve(here, "../..");
const reactPackage = path.resolve(vuePackage, "../remote-react-components");

const mode = process.env.FLOW_PARITY_MODE ?? "compare";

export default mergeConfig(defaultConfig, {
  define: {
    __PARITY_MODE__: JSON.stringify(mode),
    __PARITY_REF_DIR__: JSON.stringify(path.join(here, ".refs")),
  },
  resolve: {
    alias: [
      /*
       * The swap that makes the corpus reusable: the reused tests import their
       * environments from `@/tests/lib/environments`, and get this harness's
       * instead. Everything else they import still resolves into the React
       * package, whose `src` `@/` points at.
       */
      {
        find: /^@\/tests\/lib\/environments$/,
        replacement: path.join(here, "environments.ts"),
      },
      /*
       * `@/` belongs to the React package here. Both packages use it for their
       * own `src`, and the reused tests are the ones that need it — so the Vue
       * side is resolved through its package entry points instead, which land
       * on the built `dist`. That is also what the visual suite's `Remote`
       * environment does: the artifact is what an extension installs.
       */
      { find: /^@\//, replacement: path.join(reactPackage, "src") + "/" },
    ],
    dedupe: ["react", "react-dom", "vue"],
  },
  server: {
    fs: {
      allow: [vuePackage, reactPackage, path.resolve(vuePackage, "../..")],
    },
  },
});
