import { type RuleValidationResult } from "@/integrations/@mittwald/password-tools-js";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";

export type StateFromLatestPolicyValidationResult =
  | undefined
  | Partial<RuleValidationResult>;

/** @internal */
export const getStateFromLatestPolicyValidationResult = (
  isEmptyValue: boolean,
  result: ResolvedPolicyValidationResult,
): StateFromLatestPolicyValidationResult => {
  if (result.ruleResults.length >= 1) {
    const failingRule = result.ruleResults.find((r) => !r.isValid);
    if (failingRule) {
      return failingRule;
    }
  }

  if (result.isValid === "indeterminate") {
    return undefined;
  }

  if (!isEmptyValue) {
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
  }

  return {
    isValid: true,
    identifier: "securePassword",
  };
};

export default getStateFromLatestPolicyValidationResult;
