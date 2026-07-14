import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import postcss from "postcss";
import type { AtRule } from "postcss";
import type { Plugin } from "vite";

export const unlayeredCssPlugin = (): Plugin => ({
  name: "flow-unlayered-css",
  writeBundle: (options, bundle) => {
    for (const asset of Object.values(bundle)) {
      if (asset.type !== "asset" || asset.fileName !== "css/all.css") {
        continue;
      }

      const fileName = join(options.dir ?? "dist", asset.fileName);
      const root = postcss.parse(readFileSync(fileName, "utf8"), {
        from: fileName,
      });
      const layerAtRules: AtRule[] = [];

      root.walkAtRules("layer", (atRule) => {
        layerAtRules.push(atRule);
      });

      for (const atRule of layerAtRules) {
        if (atRule.nodes) {
          atRule.replaceWith(...atRule.nodes);
        } else {
          atRule.remove();
        }
      }

      writeFileSync(join(options.dir ?? "dist", "css/all.unlayered.css"), root.toString());
    }
  },
});
