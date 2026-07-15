import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import postcss from "postcss";
import type { AtRule } from "postcss";
import type { Plugin } from "vite";

export const stripCascadeLayers = (css: string): string => {
  const root = postcss.parse(css);
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

  return root.toString();
};

export const stylesheetVariantsPlugin = (): Plugin => ({
  name: "flow-stylesheet-variants",
  writeBundle: (options, bundle) => {
    for (const asset of Object.values(bundle)) {
      if (asset.type !== "asset" || asset.fileName !== "css/all.css") {
        continue;
      }

      const fileName = join(options.dir ?? "dist", asset.fileName);
      const layeredCss = readFileSync(fileName, "utf8");

      writeFileSync(
        join(options.dir ?? "dist", "css/all-layered.css"),
        layeredCss,
      );

      writeFileSync(fileName, stripCascadeLayers(layeredCss));

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
