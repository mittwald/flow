import { mergeConfig } from "vite";
import defaultConfig from "../../../vite.config";

export default mergeConfig(defaultConfig, {
  optimizeDeps: {
    include: [
      "react/jsx-dev-runtime",
      "react-error-boundary",
      "react-dom/client",
      "@mittwald/flow-react-components",
    ],
  },
});
