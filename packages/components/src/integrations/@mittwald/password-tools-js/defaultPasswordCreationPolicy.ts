import type { PolicyDeclaration } from ".";
import { RuleType } from ".";

export const defaultPasswordCreationPolicy: PolicyDeclaration = {
  minComplexity: 3,
  rules: [
    {
      ruleType: RuleType.length,
      min: 12,
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
