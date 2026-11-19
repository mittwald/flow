import {
  RuleType,
  type RuleValidationResult,
} from "@/integrations/@mittwald/password-tools-js";
import type { Variables } from "@internationalized/string";

const generateTranslationString = (
  rule: Partial<RuleValidationResult> & { translationKey?: string },
  shortVersion = false,
): string => {
  if (rule.translationKey) {
    return `validation.${rule.translationKey}`;
  }
  const translateString = `validation.${rule.ruleType ?? "general"}`;
  let finalTranslationString: string;

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

/** @internal */
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

interface ValidationResultFormatter {
  format: (key: string, variables?: Variables) => string;
}

/**
 * Formats the message of a validation result. A rule without a translation
 * (e.g. a custom rule or char pool) gets a generic message instead of throwing,
 * so a rejected password always shows why it was rejected.
 *
 * @internal
 */
export const formatValidationResult = (
  formatter: ValidationResultFormatter,
  result: Partial<RuleValidationResult>,
  shortVersion = false,
): string => {
  const [translationKey, translationValues] = generateValidationTranslation(
    result,
    shortVersion,
  );

  try {
    return formatter.format(translationKey, translationValues);
  } catch {
    return formatter.format(
      shortVersion
        ? "validation.general.fallback.short"
        : "validation.general.fallback",
      { isValid: result.isValid === true },
    );
  }
};

export default generateValidationTranslation;
