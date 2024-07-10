import type { Status } from "@/lib/types/props";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";

/**
 * @param result
 * @internal
 */
export const getStatusFromPolicyValidationResult = (
  result?: ResolvedPolicyValidationResult,
): Status => {
  if (result && result.isValid) {
    if (
      result.complexity &&
      result.complexity.actual === result.complexity.min &&
      result.complexity.min !== 4
    ) {
      return "warning";
    }

    return "success";
  }

  return "danger";
};

export default getStatusFromPolicyValidationResult;
