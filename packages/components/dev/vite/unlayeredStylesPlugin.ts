import type postcss from "postcss";
import { stripCascadeLayersFromRoot } from "./stylesheetVariantsPlugin.ts";

/**
 * Serves every rule unlayered — dev, Storybook and the default browser test
 * project, which mirror the default stylesheet variant. That variant is built
 * by stripping the layers off the layered one, so stripping them here keeps the
 * two pipelines in step: the same source, the same cascade.
 *
 * Component modules reach this plugin with their markers already lifted, so
 * there is nothing left to strip in them; what it actually flattens is the
 * base/token layer coming from `src/styles/index.scss`.
 */
export const unlayeredStylesPluginName = "flow-unlayered-styles";

export const unlayeredStylesPlugin = () => ({
  postcssPlugin: unlayeredStylesPluginName,
  OnceExit: (root: postcss.Root) => {
    stripCascadeLayersFromRoot(root);
  },
});
