import postcss from "postcss";

const componentsLayer = "flow.components";

/**
 * Not a real layer, but a build instruction: take this block out of every
 * layer. Component styles use it for the few rules that have to beat CSS a
 * dependency injects at runtime — unlayered CSS wins over layered CSS
 * regardless of specificity, so layered rules could never override it.
 */
export const unlayeredMarker = "flow.unlayered";

const isUnlayeredMarker = (node: postcss.ChildNode): node is postcss.AtRule =>
  node.type === "atrule" &&
  node.name === "layer" &&
  node.params.trim() === unlayeredMarker;

export const flowComponentsLayerPlugin = () => ({
  postcssPlugin: "flow-components-layer",
  Once: (root: postcss.Root, { result }: { result: postcss.Result }) => {
    const from = (result.opts.from ?? "").replaceAll("\\", "/");

    if (
      !from.includes("/src/components/") ||
      !(from.endsWith(".module.scss") || from.endsWith(".module.css"))
    ) {
      return;
    }

    root.walkAtRules("layer", (atRule) => {
      if (isUnlayeredMarker(atRule) && atRule.parent?.type !== "root") {
        throw atRule.error(
          `'@layer ${unlayeredMarker}' has to sit at the top level of the stylesheet – ` +
            `it cannot be lifted out of an enclosing at rule without duplicating that at rule. ` +
            `Move the enclosing at rule inside the '@layer ${unlayeredMarker}' block instead.`,
        );
      }
    });

    /*
     * Segment the top-level nodes at the markers: each run of ordinary nodes
     * gets its own components layer, each marker is replaced in place by its
     * contents and stays unlayered. In place, because the unlayered stylesheet
     * variant strips all layers again, and source order decides there.
     */
    const segments: postcss.ChildNode[] = [];
    let layer: postcss.AtRule | undefined;

    for (const node of [...root.nodes]) {
      if (isUnlayeredMarker(node)) {
        layer = undefined;
        segments.push(...node.nodes);
        continue;
      }

      if (!layer) {
        layer = postcss.atRule({ name: "layer", params: componentsLayer });
        segments.push(layer);
      }

      layer.append(node);
    }

    root.removeAll();
    root.append(segments);
  },
});
