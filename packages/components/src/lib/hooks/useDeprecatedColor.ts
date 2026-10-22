import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";

/**
 * Resolves a deprecated `color` prop value to the value it renders as, and
 * warns when one is passed. Other values pass through unchanged.
 */
export const useDeprecatedColor = <
  TColor extends string,
  TReplacements extends Readonly<Record<string, string>>,
>(
  color: TColor | undefined,
  replacements: TReplacements,
):
  | Exclude<TColor, keyof TReplacements>
  | TReplacements[keyof TReplacements]
  | undefined => {
  const warnDeprecation = useWarnDeprecation();

  if (color === undefined || !Object.hasOwn(replacements, color)) {
    return color as Exclude<TColor, keyof TReplacements> | undefined;
  }

  const replacement = replacements[color] as TReplacements[keyof TReplacements];
  warnDeprecation(
    `The color '${color}' is deprecated and will be removed in a future release. Use '${replacement}' instead.`,
  );
  return replacement;
};
