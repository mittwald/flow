import type { RuleValidationResult } from "@mittwald/password-tools-js/rules";
import type translate from "@/lib/react/components/Translate";

/**
 * @param rule
 * @internal
 */
const generateTranslationString = (
  rule: Partial<RuleValidationResult>,
): string => {
  const translateString = `validation.${rule.ruleType ?? "general"}`;

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
  r: Partial<RuleValidationResult>,
): [string, Parameters<typeof translate>[1]] => {
  const translationKey = generateTranslationString(r);

  return [translationKey, r];
};

export default generateValidationTranslation;
