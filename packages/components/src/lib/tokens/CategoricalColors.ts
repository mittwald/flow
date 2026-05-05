import tokens from "@mittwald/flow-design-tokens/json/all-light.json";

export const categoricalColors = Object.keys(
  tokens.color.categorical,
) as (keyof typeof tokens.color.categorical)[];

export type CategoricalColor = (typeof categoricalColors)[number];
export type CategoricalWithCustomColor = CategoricalColor | (string & {});
