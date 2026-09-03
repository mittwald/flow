import type postcss from "postcss";

/**
 * Not a real layer, but a build instruction: take this block out of every
 * layer. Component styles use it for the few rules that have to beat CSS a
 * dependency injects at runtime — unlayered CSS wins over layered CSS
 * regardless of specificity, so a layered rule could never override it.
 */
export const unlayeredMarker = "flow.unlayered";

export const isUnlayeredMarker = (
  node: postcss.ChildNode,
): node is postcss.AtRule =>
  node.type === "atrule" &&
  node.name === "layer" &&
  node.params.trim() === unlayeredMarker;

export const isComponentModule = (from: string | undefined): boolean => {
  const path = (from ?? "").replaceAll("\\", "/");

  return (
    path.includes("/src/components/") &&
    (path.endsWith(".module.scss") || path.endsWith(".module.css"))
  );
};

/**
 * A marker deeper than the top level cannot be lifted out of the at rule
 * enclosing it without duplicating that at rule, so it is rejected instead.
 * Authors write the enclosing at rule inside the marker.
 */
export const assertMarkersAreTopLevel = (root: postcss.Root): void => {
  root.walkAtRules("layer", (atRule) => {
    if (isUnlayeredMarker(atRule) && atRule.parent?.type !== "root") {
      throw atRule.error(
        `'@layer ${unlayeredMarker}' has to sit at the top level of the stylesheet – ` +
          `it cannot be lifted out of an enclosing at rule without duplicating that at rule. ` +
          `Move the enclosing at rule inside the '@layer ${unlayeredMarker}' block instead.`,
      );
    }
  });
};

/**
 * Replaces every marker with its contents, in place. In place, because the
 * unlayered stylesheet variant carries no layers at all and source order
 * decides there — moving the rules would change that variant silently.
 */
export const liftUnlayeredMarkers = (root: postcss.Root): void => {
  for (const node of [...root.nodes]) {
    if (isUnlayeredMarker(node)) {
      node.replaceWith(...(node.nodes ?? []));
    }
  }
};

/**
 * Removes the marker without layering anything else — for dev, Storybook and
 * the browser tests, where component styles are served unlayered and the marker
 * would otherwise become a real layer that loses to Flow's own rules.
 */
export const unlayeredMarkerPluginName = "flow-unlayered-marker";
export const componentsLayerPluginName = "flow-components-layer";

export const unlayeredMarkerPlugin = () => ({
  postcssPlugin: unlayeredMarkerPluginName,
  Once: (root: postcss.Root, { result }: { result: postcss.Result }) => {
    /*
     * The release build merges its config on top of the dev config, which
     * concatenates the PostCSS plugins. Where the layer plugin is present it
     * owns the markers – it needs them intact to segment at them – so step
     * aside instead of stripping them first.
     */
    const layersComponents = result.processor.plugins.some(
      (plugin) =>
        "postcssPlugin" in plugin &&
        plugin.postcssPlugin === componentsLayerPluginName,
    );

    if (layersComponents || !isComponentModule(result.opts.from)) {
      return;
    }

    assertMarkersAreTopLevel(root);
    liftUnlayeredMarkers(root);
  },
});
