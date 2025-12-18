import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "react/jsx-dev-runtime",
      "react-error-boundary",
      "react-dom/client",
      "@mittwald/**/*",
    ],
  },
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: path.resolve(__dirname) + "/src/",
      },
      // https://github.com/tabler/tabler-icons/issues/1233#issuecomment-2428245119
      {
        find: "@tabler/icons-react",
        replacement: "@tabler/icons-react/dist/esm/icons/index.mjs",
      },
    ],
  },
});
