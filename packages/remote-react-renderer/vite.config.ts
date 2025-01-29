import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: path.resolve(__dirname) + "/src/",
      },
    ],
  },
});
