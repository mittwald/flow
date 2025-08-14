import type { PolicyDeclaration } from "@mittwald/password-tools-js/policy";
import { RuleType } from "@mittwald/password-tools-js/rules";

export const defaultPasswordCreationPolicy: PolicyDeclaration = {
  minComplexity: 3,
  rules: [
    {
      ruleType: RuleType.length,
      min: 12,
    },
    {
      ruleType: RuleType.hibp,
    },
    {
      identifier: "special",
      ruleType: RuleType.charPool,
      charPools: ["special"],
    },
    {
      identifier: "numbers",
      ruleType: RuleType.charPool,
      charPools: ["numbers"],
    },
  ],
};
