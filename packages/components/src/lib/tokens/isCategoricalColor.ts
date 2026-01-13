import {
  type CategoricalColor,
  categoricalColors,
} from "@/lib/tokens/CategoricalColors";

export function isCategoricalColor(
  something: unknown,
): something is CategoricalColor {
  const anyCategoricalColors = categoricalColors as readonly string[];
  return (
    typeof something === "string" && anyCategoricalColors.includes(something)
  );
}
