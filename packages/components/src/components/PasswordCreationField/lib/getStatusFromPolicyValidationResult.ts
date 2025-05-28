import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";
import type { ComplexityStatus } from "@/components/PasswordCreationField/components/ComplexityIndicator/ComplexityIndicator";

/**
 * @param result
 * @internal
 */
export const getStatusFromPolicyValidationResult = (
  result: ResolvedPolicyValidationResult,
): ComplexityStatus => {
  if (result.isValid === true) {
    if (
      result.complexity &&
      result.complexity.actual === result.complexity.min &&
      result.complexity.min !== 4
    ) {
      return "warning";
    }

    return "success";
  } else if (result.isValid === "indeterminate") {
    return "indeterminate";
  }

  return "danger";
};

export default getStatusFromPolicyValidationResult;
