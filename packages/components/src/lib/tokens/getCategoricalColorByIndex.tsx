import {
  type CategoricalColor,
  categoricalColors,
} from "@/lib/tokens/CategoricalColors";

/**
 * The categorical color at a position in the default order; the last one
 * repeats.
 */
export const getCategoricalColorByIndex = (index: number): CategoricalColor =>
  categoricalColors[
    Math.min(index, categoricalColors.length - 1)
  ] as CategoricalColor;
