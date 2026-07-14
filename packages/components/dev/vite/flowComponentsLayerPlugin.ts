import postcss from "postcss";

export const flowComponentsLayerPlugin = () => ({
  postcssPlugin: "flow-components-layer",
  Once: (root: postcss.Root, { result }: { result: postcss.Result }) => {
    const from = result.opts.from ?? "";

    if (
      !from.includes("/src/components/") ||
      !(from.endsWith(".module.scss") || from.endsWith(".module.css"))
    ) {
      return;
    }

    const layer = postcss.atRule({
      name: "layer",
      params: "flow.components",
    });

    layer.append(...(root.nodes ?? []));
    root.removeAll();
    root.append(layer);
  },
});
