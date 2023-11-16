import { defineConfig } from "vite";
import postcssNesting from "postcss-nesting";

export default defineConfig({
  resolve: {
    alias: {
      "@/": "/src/",
    },
  },
  css: {
    postcss: {
      plugins: [postcssNesting],
    },
    modules: {
      generateScopedName: (name, filename) => {
        if (name === "flow") {
          return name;
        }

        const parts = Array.from(
          filename.matchAll(/.*components\/(.*?)\/styles.module.css/gm),
        ).map((p) => p[1]);

        if (parts.length > 0) {
          if (name !== "root") {
            parts.push(name);
          }

          return "flow-" + parts.map((p) => p.toLowerCase()).join("-");
        }

        return name;
      },
    },
  },
});
