/**
 * Formats a number that already is a percentage: `40` reads "40%" in English
 * and "40 %" in German.
 *
 * @internal
 */
export const percentFormatOptions: Intl.NumberFormatOptions = {
  style: "unit",
  unit: "percent",
};
