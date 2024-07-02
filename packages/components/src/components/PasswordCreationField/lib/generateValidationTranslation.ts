import type { RuleValidationResult } from "@mittwald/password-validation/rules";
import type translate from "@/lib/react/components/Translate";

/**
 * @param rule
 * @internal
 */
const generateTranslationString = (rule: RuleValidationResult): string => {
  const translateString = `validation.${rule.ruleType}`;

  if ("min" in rule || "max" in rule) {
    const breakingBoundaryProperty = rule.failingBoundary
      ? rule.failingBoundary
      : "min";

    if (rule.identifier) {
      return `${translateString}.${rule.identifier}.${breakingBoundaryProperty}`;
    }

    return `${translateString}.${breakingBoundaryProperty}`;
  }

  if (rule.identifier) {
    return `${translateString}.${rule.identifier}`;
  }

  return `${translateString}`;
};

export const generateValidationTranslation = (
  r: RuleValidationResult,
): [string, Parameters<typeof translate>[1]] => {
  const translationKey = generateTranslationString(r);

  return [translationKey, r];
};

export default generateValidationTranslation;
