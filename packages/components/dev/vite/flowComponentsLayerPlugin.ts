import postcss from "postcss";
import {
  assertMarkersAreTopLevel,
  isComponentModule,
  isUnlayeredMarker,
} from "./unlayeredMarker";

const componentsLayer = "flow.components";

export const flowComponentsLayerPlugin = () => ({
  postcssPlugin: "flow-components-layer",
  Once: (root: postcss.Root, { result }: { result: postcss.Result }) => {
    if (!isComponentModule(result.opts.from)) {
      return;
    }

    assertMarkersAreTopLevel(root);

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
