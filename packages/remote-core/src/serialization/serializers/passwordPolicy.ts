import { Serializer } from "@/serialization/Serializer";
import {
  Policy,
  type PolicyDeclaration,
} from "@mittwald/flow-react-components/mittwald-password-tools-js";

export const passwordPolicySerializer = new Serializer<
  Policy,
  PolicyDeclaration
>({
  name: "PasswordPolicy",
  serialize: {
    isApplicable: (val) => Policy.isPolicy(val),
    apply: (policy) => policy.toDeclaration(),
  },
  deserialize: {
    apply: (policyDeclaration) => Policy.fromDeclaration(policyDeclaration),
  },
});
