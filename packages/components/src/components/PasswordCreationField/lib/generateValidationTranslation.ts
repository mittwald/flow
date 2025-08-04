import {
  RuleType,
  type RuleValidationResult,
} from "@/integrations/@mittwald/password-tools-js";

const generateTranslationString = (
  rule: Partial<RuleValidationResult> & { translationKey?: string },
  shortVersion = false,
): string => {
  if (rule.translationKey) {
    return `validation.${rule.translationKey}`;
  }
  const translateString = `validation.${rule.ruleType ?? "general"}`;
  let finalTranslationString = "";

  if (
    ("min" in rule && rule.min !== undefined) ||
    ("max" in rule && rule.max !== undefined)
  ) {
    const breakingBoundaryProperty = rule.failingBoundary
      ? rule.failingBoundary
      : rule.min
        ? "min"
        : "max";

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
): [string, Record<string, string | number | boolean> | undefined] => {
  const translationKey = generateTranslationString(r, shotVersion);

  if (r.ruleType === RuleType.char && r.chars) {
    return [
      translationKey,
      { ...r, chars: r.chars.map((c) => c.char).join("") },
    ];
  }

  return [
    translationKey,
    r as unknown as Record<string, string | number | boolean> | undefined,
  ];
};

export default generateValidationTranslation;
