import type { Plugin } from "vite";
import * as fs from "node:fs";
import * as path from "node:path";

export const flowCssLayerName = "flow";
export const flowCssLayerOrder = [
  `${flowCssLayerName}.reset`,
  `${flowCssLayerName}.base`,
  `${flowCssLayerName}.theme`,
  `${flowCssLayerName}.components`,
];

const unlayeredSourceLayerName = "unlayered";
const sourceLayerNames = new Set([
  "reset",
  "base",
  "theme",
  unlayeredSourceLayerName,
]);

const findBlockEnd = (css: string, blockStart: number): number => {
  let depth = 0;
  let quote: string | undefined;
  let inComment = false;

  for (let i = blockStart; i < css.length; i++) {
    const current = css[i];
    const next = css[i + 1];

    if (inComment) {
      if (current === "*" && next === "/") {
        inComment = false;
        i++;
      }
      continue;
    }

    if (quote !== undefined) {
      if (current === "\\") {
        i++;
      } else if (current === quote) {
        quote = undefined;
      }
      continue;
    }

    if (current === "/" && next === "*") {
      inComment = true;
      i++;
      continue;
    }

    if (current === '"' || current === "'") {
      quote = current;
      continue;
    }

    if (current === "{") {
      depth++;
      continue;
    }

    if (current === "}") {
      depth--;

      if (depth === 0) {
        return i + 1;
      }
    }
  }

  return css.length;
};

const isTopLevelLayerBlock = (
  css: string,
  index: number,
): { blockStart: number; layerName: string } | undefined => {
  const layer = css.slice(index).match(/^@layer\s+([a-z-]+)\s*\{/i);

  if (layer === null || !sourceLayerNames.has(layer[1] ?? "")) {
    return undefined;
  }

  const blockStart = index + layer[0].lastIndexOf("{");

  return { blockStart, layerName: layer[1] };
};

const splitCssIntoFlowLayers = (
  css: string,
): { components: string[]; layers: string[]; unlayered: string[] } => {
  const components: string[] = [];
  const layers: string[] = [];
  const unlayered: string[] = [];
  let quote: string | undefined;
  let inComment = false;
  let depth = 0;
  let lastIndex = 0;

  for (let i = 0; i < css.length; i++) {
    const current = css[i];
    const next = css[i + 1];

    if (inComment) {
      if (current === "*" && next === "/") {
        inComment = false;
        i++;
      }
      continue;
    }

    if (quote !== undefined) {
      if (current === "\\") {
        i++;
      } else if (current === quote) {
        quote = undefined;
      }
      continue;
    }

    if (current === "/" && next === "*") {
      inComment = true;
      i++;
      continue;
    }

    if (current === '"' || current === "'") {
      quote = current;
      continue;
    }

    if (current === "{") {
      depth++;
      continue;
    }

    if (current === "}") {
      depth--;
      continue;
    }

    if (depth !== 0 || current !== "@") {
      continue;
    }

    const layer = isTopLevelLayerBlock(css, i);

    if (layer === undefined) {
      continue;
    }

    components.push(css.slice(lastIndex, i));

    const blockEnd = findBlockEnd(css, layer.blockStart);
    const blockContent = css.slice(layer.blockStart + 1, blockEnd - 1);

    if (layer.layerName === unlayeredSourceLayerName) {
      unlayered.push(blockContent);
    } else {
      layers.push(
        `@layer ${flowCssLayerName}.${layer.layerName}{${blockContent}}`,
      );
    }

    i = blockEnd - 1;
    lastIndex = blockEnd;
  }

  components.push(css.slice(lastIndex));

  return { components, layers, unlayered };
};

export const wrapCssInLayer = (
  css: string,
  layerName = flowCssLayerName,
): string => {
  const charsetMatch = css.match(/^(@charset\s+["'][^"']+["'];\s*)/i);
  const charset = charsetMatch?.[0] ?? "";
  const content = css.slice(charset.length);
  const layerOrder = `@layer ${flowCssLayerOrder.join(", ")};`;

  if (content.trimStart().startsWith(layerOrder)) {
    return css;
  }

  const { components, layers, unlayered } = splitCssIntoFlowLayers(content);
  const componentCss = components.join("");
  const componentLayer = componentCss.trim()
    ? `@layer ${layerName}.components{${componentCss}}`
    : "";

  return `${charset}${layerOrder}${layers.join("")}${componentLayer}${unlayered.join("")}`;
};

export const cssLayerPlugin = (layerName = flowCssLayerName): Plugin => {
  let outDir = "";

  return {
    name: "flow-css-layer",
    enforce: "post",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    generateBundle(_, bundle) {
      for (const asset of Object.values(bundle)) {
        if (asset.type !== "asset" || !asset.fileName.endsWith(".css")) {
          continue;
        }

        const source =
          typeof asset.source === "string"
            ? asset.source
            : Buffer.from(asset.source).toString();

        asset.source = wrapCssInLayer(source, layerName);
      }
    },
    writeBundle(_, bundle) {
      for (const asset of Object.values(bundle)) {
        if (asset.type !== "asset" || !asset.fileName.endsWith(".css")) {
          continue;
        }

        const filename = path.join(outDir, asset.fileName);
        const css = fs.readFileSync(filename, "utf8");
        fs.writeFileSync(filename, wrapCssInLayer(css, layerName));
      }
    },
  };
};
