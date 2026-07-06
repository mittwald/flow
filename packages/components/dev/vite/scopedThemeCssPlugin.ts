import type { Plugin } from "vite";
import { createRequire } from "node:module";
import * as fs from "node:fs";

const require = createRequire(import.meta.url);

export const scopedThemeCssPlugin = (): Plugin => ({
  name: "flow-scoped-theme-css",
  generateBundle() {
    const css = [
      fs.readFileSync(
        require.resolve("@mittwald/flow-design-tokens/css/colors-light-scoped.css"),
        "utf8",
      ),
      fs.readFileSync(
        require.resolve("@mittwald/flow-design-tokens/css/colors-dark-scoped.css"),
        "utf8",
      ),
    ].join("\n");

    this.emitFile({
      type: "asset",
      fileName: "css/scoped-theme.css",
      source: `@layer theme{${css}}`,
    });
  },
});
