import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";
import {
  type CategoricalWithCustomColor,
  deprecatedCategoricalColors,
} from "@/lib/tokens/CategoricalColors";
import { isCategoricalColor } from "@/lib/tokens/isCategoricalColor";

/**
 * Returns a function that turns a `color` value into a CSS color: a categorical
 * color name becomes its token variable, a deprecated name the variable of its
 * replacement (with a deprecation warning), and a custom color stays as it is.
 * A function rather than a value, so segment lists can resolve every entry.
 */
export const useCategoricalColorValue = () => {
  const warnDeprecation = useWarnDeprecation();

  return (color: CategoricalWithCustomColor): string => {
    let resolved: string = color;
    if (Object.hasOwn(deprecatedCategoricalColors, color)) {
      const replacement =
        deprecatedCategoricalColors[
          color as keyof typeof deprecatedCategoricalColors
        ];
      warnDeprecation(
        `The color '${color}' is deprecated and will be removed in a future release. Use '${replacement}' instead.`,
      );
      resolved = replacement;
    }
    return isCategoricalColor(resolved)
      ? `var(--categorical--color--${resolved})`
      : resolved;
  };
};
