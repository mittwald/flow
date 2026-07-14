import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";

const layerOrderDeclaration =
  "@layer flow.tokens, flow.reset, flow.base, flow.components;";

const layerOrderPattern =
  /@layer\s+flow\.tokens\s*,\s*flow\.reset\s*,\s*flow\.base\s*,\s*flow\.components\s*;/g;

export const layerOrderPlugin = (): Plugin => ({
  name: "flow-layer-order",
  writeBundle: (options, bundle) => {
    for (const asset of Object.values(bundle)) {
      if (asset.type !== "asset" || !asset.fileName.endsWith(".css")) {
        continue;
      }

      const fileName = join(options.dir ?? "dist", asset.fileName);
      const source = readFileSync(fileName, "utf8");
      const withoutLayerOrder = source.replace(layerOrderPattern, "").trimStart();
      const charset = withoutLayerOrder.match(/^@charset\s+[^;]+;/);

      const nextSource = charset
        ? `${charset[0]}\n${layerOrderDeclaration}\n${withoutLayerOrder
            .slice(charset[0].length)
            .trimStart()}`
        : `${layerOrderDeclaration}\n${withoutLayerOrder}`;

      writeFileSync(fileName, nextSource);
    }
  },
});
