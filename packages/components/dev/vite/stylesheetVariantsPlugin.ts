import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import postcss from "postcss";
import type { AtRule } from "postcss";
import type { Plugin } from "vite";
import { unlayeredMarker } from "./flowComponentsLayerPlugin";

/**
 * The unlayered marker is a build instruction, not a layer, so it must never
 * reach the emitted stylesheet. If it did, it would silently become a real,
 * undeclared layer — which loses against the unlayered third-party CSS the
 * marked rules exist to override, reintroducing exactly the bug they fix.
 */
export const assertNoUnlayeredMarkers = (
  css: string,
  fileName: string,
): void => {
  const offendingSelectors: string[] = [];

  postcss.parse(css).walkAtRules("layer", (atRule) => {
    if (atRule.params.trim() !== unlayeredMarker) {
      return;
    }

    const firstRule = atRule.first;
    offendingSelectors.push(
      firstRule?.type === "rule" ? firstRule.selector : atRule.toString(),
    );
  });

  if (offendingSelectors.length === 0) {
    return;
  }

  throw new Error(
    `${fileName} still contains '@layer ${unlayeredMarker}' ` +
      `(${offendingSelectors.length} block(s), first one at '${offendingSelectors[0]}'). ` +
      `The marker is removed by flowComponentsLayerPlugin, which only processes ` +
      `src/components/**/*.module.{scss,css} – move the rule into a component stylesheet.`,
  );
};

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

      assertNoUnlayeredMarkers(layeredCss, "css/all-layered.css");

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
