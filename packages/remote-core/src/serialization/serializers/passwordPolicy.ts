import { Serializer } from "@/serialization/Serializer";
import type { ComplexityScore } from "@mittwald/password-tools-js/policy";
import { Policy } from "@mittwald/password-tools-js/policy";
import type { AnyRuleDeclaration } from "@mittwald/password-tools-js/rules";

export const passwordPolicySerializer = new Serializer<
  Policy,
  {
    minComplexity: ComplexityScore;
    rules: AnyRuleDeclaration[];
  }
>({
  name: "PasswordPolicy",
  serialize: {
    isApplicable: (val): val is Policy => {
      return val instanceof Policy;
    },
    apply: (policy) => {
      return policy.toTransferable();
    },
  },
  deserialize: {
    apply: (policyDeclaration) => {
      return Policy.fromDeclaration(policyDeclaration);
    },
  },
});
