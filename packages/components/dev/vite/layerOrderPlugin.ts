import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";

const layerOrderDeclaration =
  "@layer flow.tokens, flow.reset, flow.base, flow.components;";

const layerOrderPattern =
  /@layer\s+flow\.tokens\s*,\s*flow\.reset\s*,\s*flow\.base\s*,\s*flow\.components\s*;/g;

export const hoistLayerOrder = (css: string): string => {
  const withoutLayerOrder = css.replace(layerOrderPattern, "").trimStart();
  const charset = withoutLayerOrder.match(/^@charset\s+[^;]+;/);

  return charset
    ? `${charset[0]}\n${layerOrderDeclaration}\n${withoutLayerOrder
        .slice(charset[0].length)
        .trimStart()}`
    : `${layerOrderDeclaration}\n${withoutLayerOrder}`;
};

export const layerOrderPlugin = (): Plugin => ({
  name: "flow-layer-order",
  writeBundle: (options, bundle) => {
    for (const asset of Object.values(bundle)) {
      // Hoist the layer order only for the main bundled stylesheet.
      // Additional CSS assets should keep their original content untouched.
      if (asset.type !== "asset" || asset.fileName !== "css/all.css") {
        continue;
      }

      const fileName = join(options.dir ?? "dist", asset.fileName);
      const source = readFileSync(fileName, "utf8");
      writeFileSync(fileName, hoistLayerOrder(source));
    }
  },
});
