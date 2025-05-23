import { type RuleValidationResult } from "@mittwald/password-tools-js/rules";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";

/** @internal */
export const getStateFromLatestPolicyValidationResult = (
  result?: ResolvedPolicyValidationResult,
): undefined | Partial<RuleValidationResult> => {
  if (result && !result.isValid && result.ruleResults.length >= 1) {
    const failingRule = result.ruleResults.find((r) => !r.isValid);
    if (!failingRule) {
      return {
        isValid: false,
        identifier: "failingComplexity",
      };
    }

    return failingRule;
  }

  if (result && result.complexity.actual <= result.complexity.min) {
    return {
      isValid: result.isValid,
      identifier: "optimizeComplexity",
    };
  }

  if (result && result.isValid) {
    return {
      isValid: true,
      identifier: "securePassword",
    };
  }

  return undefined;
};

export default getStateFromLatestPolicyValidationResult;
