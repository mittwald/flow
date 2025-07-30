import { Policy, RuleType } from "@/integrations/@mittwald/password-tools-js";

export const defaultPasswordCreationPolicy = Policy.fromDeclaration({
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
});
