import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";

/**
 * Resolves a deprecated `color` prop value to the value it renders as, and
 * warns when one is passed. Other values pass through unchanged. `prop` names
 * the prop the replacement belongs on, where that is not the prop the value was
 * passed to.
 */
export const useDeprecatedColor = <
  TColor extends string,
  TReplacements extends Readonly<Record<string, string>>,
>(
  color: TColor | undefined,
  replacements: TReplacements,
  { prop }: { prop?: string } = {},
):
  | Exclude<TColor, keyof TReplacements>
  | TReplacements[keyof TReplacements]
  | undefined => {
  const warnDeprecation = useWarnDeprecation();

  if (color === undefined || !Object.hasOwn(replacements, color)) {
    return color as Exclude<TColor, keyof TReplacements> | undefined;
  }

  const replacement = replacements[color] as TReplacements[keyof TReplacements];
  const use = prop ? `${prop}="${replacement}"` : `'${replacement}'`;
  warnDeprecation(
    `The color '${color}' is deprecated and will be removed in a future release. Use ${use} instead.`,
  );
  return replacement;
};
