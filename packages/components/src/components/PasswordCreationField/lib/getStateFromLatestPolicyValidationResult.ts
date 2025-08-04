import { type RuleValidationResult } from "@/integrations/@mittwald/password-tools-js";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";

/** @internal */
export const getStateFromLatestPolicyValidationResult = (
  result: ResolvedPolicyValidationResult,
): undefined | Partial<RuleValidationResult> => {
  if (!result.isValid && result.ruleResults.length >= 1) {
    const failingRule = result.ruleResults.find((r) => !r.isValid);
    if (!failingRule) {
      return {
        isValid: false,
        identifier: "failingComplexity",
      };
    }

    return failingRule;
  }

  if (result.isValid === "indeterminate") {
    return undefined;
  }

  if (result.complexity.actual < result.complexity.min) {
    return {
      isValid: false,
      identifier: "failingComplexity",
    };
  }

  if (result.complexity.actual === result.complexity.min) {
    return {
      isValid: result.isValid,
      identifier: "optimizeComplexity",
    };
  }
  return {
    isValid: true,
    identifier: "securePassword",
  };
};

export default getStateFromLatestPolicyValidationResult;
