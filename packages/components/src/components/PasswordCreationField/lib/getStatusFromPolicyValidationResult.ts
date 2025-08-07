import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";
import type { ComplexityStatus } from "@/components/PasswordCreationField/components/ComplexityIndicator/ComplexityIndicator";

export const getStatusFromPolicyValidationResult = (
  isValid: ResolvedPolicyValidationResult["isValid"],
  result: ResolvedPolicyValidationResult,
): ComplexityStatus => {
  if (isValid === true) {
    if (
      result.complexity &&
      result.complexity.actual === result.complexity.min &&
      result.complexity.min !== 4
    ) {
      return "warning";
    }

    return "success";
  } else if (isValid === "indeterminate") {
    return "indeterminate";
  }

  return "danger";
};

export default getStatusFromPolicyValidationResult;
