import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import defaultConfig from "../../vite.config";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export default mergeConfig(defaultConfig, {
  resolve: {
    alias: [
      {
        find: "@mittwald/flow-remote-react-components/RemoteRoot",
        replacement: path.resolve(packageRoot, "src/components/RemoteRoot.tsx"),
      },
      {
        find: "@mittwald/flow-remote-react-components/react-hook-form",
        replacement: path.resolve(
          packageRoot,
          "src/integrations/react-hook-form/index.ts",
        ),
      },
      {
        find: "@mittwald/flow-remote-react-components",
        replacement: path.resolve(packageRoot, "src/index.ts"),
      },
    ],
  },
  optimizeDeps: {
    include: [
      "react/jsx-dev-runtime",
      "react-error-boundary",
      "react-dom/client",
      "@mittwald/flow-react-components",
    ],
  },
});
