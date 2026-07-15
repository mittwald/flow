import { Label } from "@mittwald/flow-react-components";
import { PasswordCreationField } from "@mittwald/flow-react-components/mittwald-password-tools-js";
import { useState } from "react";

export default () => {
  const [password, setPassword] = useState("");

  return (
    <PasswordCreationField
      value={password}
      onChange={setPassword}
    >
      <Label>Password</Label>
    </PasswordCreationField>
  );
};
