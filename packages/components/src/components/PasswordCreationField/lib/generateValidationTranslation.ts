import type { RuleValidationResult } from "@mittwald/password-tools-js/rules";
import type translate from "@/lib/react/components/Translate";

const generateTranslationString = (
  rule: Partial<RuleValidationResult>,
  shortVersion = false,
): string => {
  const translateString = `validation.${rule.ruleType ?? "general"}`;
  let finalTranslationString = "";

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
  r: Partial<RuleValidationResult>,
  shotVersion = false,
): [string, Parameters<typeof translate>[1]] => {
  const translationKey = generateTranslationString(r, shotVersion);

  return [translationKey, r];
};

export default generateValidationTranslation;
