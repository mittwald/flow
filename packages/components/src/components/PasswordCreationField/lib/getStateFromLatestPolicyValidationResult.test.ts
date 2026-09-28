import { describe, expect, test } from "vitest";
import { getStateFromLatestPolicyValidationResult } from "./getStateFromLatestPolicyValidationResult";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";
import {
  RuleType,
  type RuleValidationResult,
} from "@/integrations/@mittwald/password-tools-js";

const lengthRule = (isValid: boolean): RuleValidationResult => ({
  ruleType: RuleType.length,
  identifier: "length",
  length: 4,
  min: 8,
  isValid,
});

const hibpRule = (isValid: boolean): RuleValidationResult => ({
  ruleType: RuleType.hibp,
  identifier: "hibp",
  isValid,
});

const result = (
  overrides: Partial<ResolvedPolicyValidationResult> = {},
): ResolvedPolicyValidationResult => ({
  isValid: true,
  complexity: { min: 2, actual: 3, warning: null },
  ruleResults: [],
  ...overrides,
});

describe("getStateFromLatestPolicyValidationResult", () => {
  test("an unevaluated policy has no state yet", () => {
    expect(
      getStateFromLatestPolicyValidationResult(
        false,
        result({ isValid: "indeterminate" }),
      ),
    ).toBeUndefined();
  });

  test("the first failing rule is reported, not the last", () => {
    const failing = lengthRule(false);

    expect(
      getStateFromLatestPolicyValidationResult(
        false,
        result({
          isValid: false,
          ruleResults: [hibpRule(true), failing, hibpRule(false)],
        }),
      ),
    ).toBe(failing);
  });

  test("a failing rule outranks the complexity", () => {
    expect(
      getStateFromLatestPolicyValidationResult(
        false,
        result({
          isValid: false,
          complexity: { min: 2, actual: 0, warning: null },
          ruleResults: [lengthRule(false)],
        }),
      ),
    ).toMatchObject({ ruleType: RuleType.length });
  });

  test("all rules passing but complexity below the minimum fails the complexity", () => {
    expect(
      getStateFromLatestPolicyValidationResult(
        false,
        result({
          isValid: false,
          complexity: { min: 3, actual: 1, warning: null },
          ruleResults: [lengthRule(true)],
        }),
      ),
    ).toEqual({ isValid: false, identifier: "failingComplexity" });
  });

  test("complexity exactly at the minimum suggests optimizing it", () => {
    expect(
      getStateFromLatestPolicyValidationResult(
        false,
        result({ complexity: { min: 3, actual: 3, warning: null } }),
      ),
    ).toEqual({ isValid: true, identifier: "optimizeComplexity" });
  });

  test("complexity above the minimum is a secure password", () => {
    expect(
      getStateFromLatestPolicyValidationResult(
        false,
        result({ complexity: { min: 2, actual: 4, warning: null } }),
      ),
    ).toEqual({ isValid: true, identifier: "securePassword" });
  });

  /*
   * An empty field has nothing to optimize: its complexity is reported as 0 and
   * would otherwise always read as "too simple" before the user typed anything.
   */
  test("an empty value skips the complexity states entirely", () => {
    expect(
      getStateFromLatestPolicyValidationResult(
        true,
        result({
          isValid: false,
          complexity: { min: 3, actual: 0, warning: null },
        }),
      ),
    ).toEqual({ isValid: true, identifier: "securePassword" });
  });

  test("an empty value still reports a failing rule", () => {
    expect(
      getStateFromLatestPolicyValidationResult(
        true,
        result({ isValid: false, ruleResults: [lengthRule(false)] }),
      ),
    ).toMatchObject({ ruleType: RuleType.length, isValid: false });
  });
});
