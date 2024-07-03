import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/lib/getStatusFromPolicyValidationResult";
import { type RuleValidationResult } from "@mittwald/password-tools-js/rules";

/**
 * @param result
 * @internal
 */
export const getFirstErrorFromPolicyValidationResult = (
  result?: ResolvedPolicyValidationResult,
): undefined | RuleValidationResult => {
  if (result && !result.isValid && result.ruleResults.length >= 1) {
    return result.ruleResults.find((r) => !r.isValid);
  }

  return undefined;
};

export default getFirstErrorFromPolicyValidationResult;
