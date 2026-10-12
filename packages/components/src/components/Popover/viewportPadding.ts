import tokens from "@mittwald/flow-design-tokens/json-runtime/all-light.json";

/**
 * The gap a popover keeps to the viewport edge. The stylesheet caps the
 * popover's width with it, `containerPadding` insets the position by it — and
 * `containerPadding` is a number, so it cannot read the CSS variable.
 *
 * @internal
 */
export const popoverViewportPadding = Number.parseFloat(
  tokens.popover["viewport-padding"].value,
);
