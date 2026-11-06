import { flowDarkScopeClass } from "./flowDarkScopeClass";

/** The declarations of the rule with exactly this selector */
const declarationsOf = (css: string, selector: string) => {
  const start = css.indexOf(`${selector}{`);
  if (start < 0) {
    throw new Error(`Flow CSS has no rule for ${selector}`);
  }
  const from = start + selector.length + 1;
  return css.slice(from, css.indexOf("}", from));
};

/**
 * Flow switches its tokens on `:root[data-theme]` only, and resolves its
 * component tokens there, so a few dark colors on a section are not enough: the
 * scope declares all of Flow's tokens again, with the dark values. The text
 * color is inherited as a resolved value, so it is set again as well.
 */
export const buildFlowDarkScopeCss = (flowCss: string) => {
  const scope = `.${flowDarkScopeClass}`;
  return [
    `${scope}{${declarationsOf(flowCss, ":root")};${declarationsOf(flowCss, ":root[data-theme=dark]")};color-scheme:dark;color:var(--text--color--default)}`,
    `${scope} [class*=flow--]{color-scheme:dark}`,
  ].join("\n");
};
