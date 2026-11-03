import tokens from "@mittwald/flow-design-tokens/json-runtime/all-light.json";

export const categoricalColors = Object.keys(
  tokens.categorical.color,
) as (keyof typeof tokens.categorical.color)[];

export type CategoricalColor = (typeof categoricalColors)[number];
export type CategoricalWithCustomColor = CategoricalColor | (string & {});
