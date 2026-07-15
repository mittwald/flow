import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import postcss from "postcss";
import type { AtRule } from "postcss";
import type { Plugin } from "vite";

export const stylesheetVariantsPlugin = (): Plugin => ({
  name: "flow-stylesheet-variants",
  writeBundle: (options, bundle) => {
    for (const asset of Object.values(bundle)) {
      if (asset.type !== "asset" || asset.fileName !== "css/all.css") {
        continue;
      }

      const fileName = join(options.dir ?? "dist", asset.fileName);
      const layeredCss = readFileSync(fileName, "utf8");
      const root = postcss.parse(layeredCss, {
        from: fileName,
      });
      const layerAtRules: AtRule[] = [];

      writeFileSync(
        join(options.dir ?? "dist", "css/all-layered.css"),
        layeredCss,
      );

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

      writeFileSync(fileName, root.toString());

      const previousUnlayeredFileName = join(
        options.dir ?? "dist",
        "css/all.unlayered.css",
      );
      if (existsSync(previousUnlayeredFileName)) {
        unlinkSync(previousUnlayeredFileName);
      }
    }
  },
});
