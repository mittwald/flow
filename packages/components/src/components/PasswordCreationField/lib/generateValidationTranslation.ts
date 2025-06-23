import type { RuleValidationResult } from "@mittwald/password-tools-js/rules";

const generateTranslationString = (
  rule: Partial<RuleValidationResult> & { translationKey?: string },
  shortVersion = false,
): string => {
  if (rule.translationKey) {
    return `validation.${rule.translationKey}`;
  }
  const translateString = `validation.${rule.ruleType ?? "general"}`;
  let finalTranslationString: string;

  if ("min" in rule || "max" in rule) {
    const breakingBoundaryProperty = rule.failingBoundary
      ? rule.failingBoundary
      : "min";

    if (rule.identifier) {
      finalTranslationString = `${translateString}.${rule.identifier}.${breakingBoundaryProperty}`;
    } else {
      finalTranslationString = `${translateString}.${breakingBoundaryProperty}`;
    }
  } else if (rule.identifier) {
    finalTranslationString = `${translateString}.${rule.identifier}`;
  } else {
    finalTranslationString = translateString;
  }

  return shortVersion
    ? `${finalTranslationString}.short`
    : finalTranslationString;
};

export const generateValidationTranslation = (
  r: Partial<RuleValidationResult> & { translationKey?: string },
  shotVersion = false,
): [string, Record<string, string | number | boolean> | undefined] => {
  const translationKey = generateTranslationString(r, shotVersion);

  return [
    translationKey,
    r as unknown as Record<string, string | number | boolean> | undefined,
  ];
};

export default generateValidationTranslation;
