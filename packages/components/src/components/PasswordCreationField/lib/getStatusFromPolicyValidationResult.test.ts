import { describe, expect, test } from "vitest";
import { getStatusFromPolicyValidationResult } from "./getStatusFromPolicyValidationResult";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";
import type { ComplexityScore } from "@/integrations/@mittwald/password-tools-js";

const result = (
  isValid: ResolvedPolicyValidationResult["isValid"],
  complexity: { min: ComplexityScore; actual: ComplexityScore },
): ResolvedPolicyValidationResult => ({
  isValid,
  complexity: { ...complexity, warning: null },
  ruleResults: [],
});

describe("getStatusFromPolicyValidationResult", () => {
  test("an unmet policy is danger", () => {
    const r = result(false, { min: 2, actual: 1 });
    expect(getStatusFromPolicyValidationResult(false, r)).toBe("danger");
  });

  test("an unevaluated policy is indeterminate", () => {
    const r = result("indeterminate", { min: 2, actual: 4 });
    expect(getStatusFromPolicyValidationResult("indeterminate", r)).toBe(
      "indeterminate",
    );
  });

  test("a password above the required complexity is success", () => {
    const r = result(true, { min: 2, actual: 3 });
    expect(getStatusFromPolicyValidationResult(true, r)).toBe("success");
  });

  test("a password exactly at the required complexity is a warning", () => {
    const r = result(true, { min: 2, actual: 2 });
    expect(getStatusFromPolicyValidationResult(true, r)).toBe("warning");
  });

  /*
   * 4 is the top of the complexity scale, so a password sitting exactly on a
   * minimum of 4 has nothing left to improve — warning would ask for the
   * impossible.
   */
  test("the maximum complexity is success even when it only just meets the minimum", () => {
    const r = result(true, { min: 4, actual: 4 });
    expect(getStatusFromPolicyValidationResult(true, r)).toBe("success");
  });

  test("the passed isValid wins over the one carried by the result", () => {
    const r = result(true, { min: 2, actual: 3 });
    expect(getStatusFromPolicyValidationResult(false, r)).toBe("danger");
  });
});
