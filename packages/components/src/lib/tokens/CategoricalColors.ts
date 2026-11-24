import tokens from "@mittwald/flow-design-tokens/json-runtime/all-light.json";

/** The categorical colors, in their default order. */
export const categoricalColors = Object.keys(
  tokens.categorical.color,
) as (keyof typeof tokens.categorical.color)[];

export type CategoricalColor = (typeof categoricalColors)[number];

/**
 * The names of the former palette, each mapped to the color at its position in
 * the default order. `violet` and `green` stay valid but move to other slots,
 * so a chart that used `magenta` and `violet`, or `malachite` and `green`, gets
 * one color twice.
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
