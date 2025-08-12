import {
  Label,
  PasswordCreationField,
} from "@mittwald/flow-react-components";

import {
  Policy,
  RuleType,
} from "@mittwald/flow-react-components/mittwald-password-tools-js";
import { useState } from "react";

export default () => {
  const [password, setPassword] = useState("");

  return (
    <PasswordCreationField
      validationPolicy={Policy.fromDeclaration({
        minComplexity: 3,
        rules: [
          {
            ruleType: RuleType.length,
            min: 8,
            max: 12,
          },
          {
            ruleType: RuleType.regex,
            pattern: "^[0-9]",
            min: 1,
            max: 2,
          },
          {
            ruleType: RuleType.hibp,
          },
          {
            identifier: "special",
            ruleType: RuleType.charPool,
            charPools: ["special"],
            min: 1,
            max: 2,
          },
          {
            identifier: "numbers",
            ruleType: RuleType.charPool,
            charPools: ["numbers"],
            min: 1,
            max: 2,
          },
          {
            ruleType: RuleType.blocklist,
            blocklist: ["foo", "bar"],
            substringMatch: true,
          },
        ],
      })}
      value={password}
      onChange={setPassword}
    >
      <Label>Password</Label>
    </PasswordCreationField>
  );
};
