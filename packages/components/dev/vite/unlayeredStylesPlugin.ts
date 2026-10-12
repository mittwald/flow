import type postcss from "postcss";
import { stripCascadeLayersFromRoot } from "./stylesheetVariantsPlugin.ts";

/**
 * Flattens every cascade layer, so the vitest `browser` project renders against
 * the default stylesheet variant — which `stylesheetVariantsPlugin` derives
 * from the layered one the same way.
 *
 * Registered there and nowhere else. Dev and Storybook import the same
 * `src/styles` entry and keep its layers.
 *
 * Deliberately unscoped, unlike the sibling plugins: the only `@layer` left to
 * meet is that entry's, because `unlayeredMarkerPlugin` has already lifted the
 * `flow.unlayered` markers out of the component modules by then.
 */
export const unlayeredStylesPluginName = "flow-unlayered-styles";

export const unlayeredStylesPlugin = () => ({
  postcssPlugin: unlayeredStylesPluginName,
  OnceExit: (root: postcss.Root) => {
    stripCascadeLayersFromRoot(root);
  },
});
