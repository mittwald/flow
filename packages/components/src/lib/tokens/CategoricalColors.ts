import tokens from "@mittwald/flow-design-tokens/variables.json";

export const categoricalColors = Object.keys(
  tokens.color.categorical,
) as (keyof typeof tokens.color.categorical)[];
export type CategoricalColors = (typeof categoricalColors)[number];
