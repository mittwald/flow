import tokens from "@mittwald/flow-design-tokens/json-runtime/all-light.json";

/** The categorical colors, in their default order. */
export const categoricalColors = Object.keys(
  tokens.categorical.color,
) as (keyof typeof tokens.categorical.color)[];

export type CategoricalColor = (typeof categoricalColors)[number];

/**
 * The names of the former palette, each mapped to the color at its position in
 * the default order, so a chart that followed the old order still does.
 * `violet` and `green` are names of the current palette and stay valid.
 */
export const deprecatedCategoricalColors = {
  "sea-green": "indigo",
  "palatinate-blue": "amber",
  tangerine: "teal",
  magenta: "violet",
  "tropical-indigo": "berry",
  malachite: "green",
  azure: "blue",
  yellow: "cyan",
  "alloy-orange": "plum",
  lime: "red",
} as const satisfies Record<string, CategoricalColor>;

export type DeprecatedCategoricalColor =
  keyof typeof deprecatedCategoricalColors;

export type CategoricalWithCustomColor =
  CategoricalColor | DeprecatedCategoricalColor | (string & {});
